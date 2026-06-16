import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Selection {
  id: string; matchId: string; matchName: string; market: string; outcome: string; odds: number;
}
export interface PlacedBet {
  id: string; matchName: string; outcome: string; odds: number; stake: number; potentialWin: number;
  status: 'Pending' | 'Won' | 'Lost' | 'Cashed Out'; date: string;
}

interface BetslipState {
  selections: Selection[]; stake: number; mode: 'REAL' | 'SIM'; notification: string | null;
  betHistory: PlacedBet[]; hasClaimedBonus: boolean; quickBetEnabled: boolean; quickBetStake: number;
  totalWagered: number; achievements: string[];
  promoCodeApplied: boolean; appliedPromoValue: number;
  isCoolOffActive: boolean; coolOffUntil: number | null;
  
  addSelection: (sel: Selection) => void; removeSelection: (id: string) => void; setStake: (s: number) => void;
  toggleMode: () => void; clearBetslip: () => void; placeBet: (o: number, w: number) => void;
  claimDailyBonus: () => void; cashOutBet: (id: string, val: number) => void;
  toggleQuickBet: () => void; setQuickBetStake: (s: number) => void; quickPlaceBet: (s: Selection) => void;
  addAchievement: (b: string) => void; applyPromoCode: (code: string) => void;
  activateCoolOff: (hours: number) => void; deactivateCoolOff: () => void;
}

export const useBetslipStore = create<BetslipState>()(
  persist(
    (set, get) => ({
      selections: [], stake: 0, mode: 'REAL', notification: null, betHistory: [], hasClaimedBonus: false,
      quickBetEnabled: false, quickBetStake: 10, totalWagered: 0, achievements: [],
      promoCodeApplied: false, appliedPromoValue: 0, isCoolOffActive: false, coolOffUntil: null,

      addSelection: (sel) => set((st) => st.selections.find(s => s.id === sel.id) ? st : { selections: [...st.selections, sel] }),
      removeSelection: (id) => set((st) => ({ selections: st.selections.filter(s => s.id !== id) })),
      setStake: (stake) => set({ stake }),
      toggleMode: () => set((st) => ({ mode: st.mode === 'REAL' ? 'SIM' : 'REAL' })),
      clearBetslip: () => set({ selections: [], stake: 0, notification: null }),

      placeBet: (totalOdds, potentialWin) => {
        const { selections, stake, mode, totalWagered, achievements, appliedPromoValue } = get();
        if (selections.length === 0 || stake <= 0) return;
        
        const bonusStake = appliedPromoValue > 0 ? stake * (1 + appliedPromoValue) : stake;
        const newBets: PlacedBet[] = selections.map(sel => ({
          id: Math.random().toString(36).substr(2, 9), matchName: sel.matchName, outcome: sel.outcome,
          odds: sel.odds, stake: bonusStake, potentialWin: potentialWin + (appliedPromoValue > 0 ? bonusStake : 0),
          status: 'Pending', date: new Date().toLocaleDateString()
        }));

        let newAchievements = [...achievements];
        let msg = null;
        if (!achievements.includes('First Bet Placed')) { newAchievements.push('First Bet Placed'); msg = '🏆 Achievement Unlocked: First Bet Placed!'; }

        set((st) => ({
          betHistory: [...newBets, ...st.betHistory], selections: [], stake: 0,
          totalWagered: totalWagered + bonusStake, achievements: newAchievements, appliedPromoValue: 0, promoCodeApplied: false,
          notification: msg || `✅ Successfully placed ${mode} bet for GHS ${bonusStake.toFixed(2)}!`
        }));
        setTimeout(() => set({ notification: null }), 4000);
      },

      claimDailyBonus: () => { set({ hasClaimedBonus: true, notification: `🎉 Welcome back, Harriette! GHS 25.00 Daily Bonus added!` }); setTimeout(() => set({ notification: null }), 4000); },
      cashOutBet: (betId, cashOutValue) => { set((st) => ({ betHistory: st.betHistory.map(b => b.id === betId ? { ...b, status: 'Cashed Out' as const } : b), notification: `✅ Successfully cashed out GHS ${cashOutValue.toFixed(2)}!` })); setTimeout(() => set({ notification: null }), 3000); },
      toggleQuickBet: () => set((st) => ({ quickBetEnabled: !st.quickBetEnabled })),
      setQuickBetStake: (stake) => set({ quickBetStake: stake }),
      
      quickPlaceBet: (selection) => {
        const { quickBetStake, mode, betHistory, totalWagered, achievements, isCoolOffActive } = get();
        if (isCoolOffActive) { set({ notification: '🔒 Account is in Cool-Off. Betting is disabled.' }); setTimeout(() => set({ notification: null }), 3000); return; }
        
        let newAchievements = [...achievements];
        if (!achievements.includes('First Bet Placed')) newAchievements.push('First Bet Placed');
        
        set({
          betHistory: [{ id: Math.random().toString(36).substr(2, 9), matchName: selection.matchName, outcome: selection.outcome, odds: selection.odds, stake: quickBetStake, potentialWin: quickBetStake * selection.odds, status: 'Pending', date: new Date().toLocaleDateString() }, ...betHistory],
          totalWagered: totalWagered + quickBetStake, achievements: newAchievements,
          notification: `⚡ Quick Bet Placed! GHS ${quickBetStake} on ${selection.outcome}`
        });
        setTimeout(() => set({ notification: null }), 4000);
      },

      addAchievement: (badge) => set((st) => st.achievements.includes(badge) ? st : { achievements: [...st.achievements, badge], notification: `🏆 Achievement Unlocked: ${badge}!` }),
      applyPromoCode: (code) => {
        const validCodes: Record<string, number> = { 'WELCOME25': 0.25, 'BETNOVA10': 0.10 };
        const bonus = validCodes[code.toUpperCase()];
        if (!bonus) { set({ notification: '🚫 Invalid promo code.' }); setTimeout(() => set({ notification: null }), 3000); return; }
        set({ promoCodeApplied: true, appliedPromoValue: bonus, notification: `✅ Promo code applied! +${bonus * 100}% bonus on next bet.` });
        setTimeout(() => set({ notification: null }), 3000);
      },
      activateCoolOff: (hours) => {
        const until = Date.now() + (hours * 60 * 60 * 1000);
        set({ isCoolOffActive: true, coolOffUntil: until, notification: `🔒 Cool-Off activated for ${hours} hours. Betting locked.` });
        setTimeout(() => set({ notification: null }), 4000);
      },
      deactivateCoolOff: () => set({ isCoolOffActive: false, coolOffUntil: null, notification: '🔓 Cool-Off removed. Betting restored.' })
    }),
    { name: 'betnova-betslip-storage' }
  )
);
