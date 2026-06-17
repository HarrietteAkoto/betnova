import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Selection {
  id: string; matchId: string; matchName: string; market: string; outcome: string; odds: number;
}
export interface PlacedBet {
  id: string; matchName: string; outcome: string; odds: number; stake: number; potentialWin: number;
  status: 'Pending' | 'Won' | 'Lost' | 'Cashed Out' | 'Free Bet'; date: string;
}

type Currency = 'GHS' | 'USD' | 'EUR';

interface BetslipState {
  selections: Selection[]; stake: number; mode: 'REAL' | 'SIM'; notification: string | null;
  betHistory: PlacedBet[]; hasClaimedBonus: boolean; quickBetEnabled: boolean; quickBetStake: number;
  totalWagered: number; achievements: string[];
  promoCodeApplied: boolean; appliedPromoValue: number;
  isCoolOffActive: boolean; coolOffUntil: number | null;
  currency: Currency; favorites: string[];
  // NEW: Security & Promos
  transactionPin: string; 
  freeBetBalance: number;
  useFreeBet: boolean;

  addSelection: (sel: Selection) => void; removeSelection: (id: string) => void; setStake: (s: number) => void;
  toggleMode: () => void; clearBetslip: () => void; placeBet: (o: number, w: number) => void;
  claimDailyBonus: () => void; cashOutBet: (id: string, val: number) => void;
  toggleQuickBet: () => void; setQuickBetStake: (s: number) => void; quickPlaceBet: (s: Selection) => void;
  addAchievement: (b: string) => void; applyPromoCode: (code: string) => void;
  activateCoolOff: (hours: number) => void; deactivateCoolOff: () => void;
  setCurrency: (c: Currency) => void; toggleFavorite: (matchId: string) => void;
  setTransactionPin: (pin: string) => void; toggleFreeBet: () => void; addFreeBet: (amount: number) => void;
  loadBookingCode: (code: string) => void;
}

// Mock Booking Codes Database
const bookingCodes: Record<string, Selection[]> = {
  'WC2026': [
    { id: 'wc-1', matchId: 'wc', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Brazil (2)', odds: 1.65 },
    { id: 'wc-2', matchId: 'wc', matchName: 'Ghana vs Brazil', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.80 }
  ],
  'BIGWIN': [
    { id: 'bw-1', matchId: 'bw', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45 }
  ]
};

export const useBetslipStore = create<BetslipState>()(
  persist(
    (set, get) => ({
      selections: [], stake: 0, mode: 'REAL', notification: null, betHistory: [], hasClaimedBonus: false,
      quickBetEnabled: false, quickBetStake: 10, totalWagered: 0, achievements: [],
      promoCodeApplied: false, appliedPromoValue: 0, isCoolOffActive: false, coolOffUntil: null,
      currency: 'GHS', favorites: [],
      transactionPin: '1234', // Default mock PIN
      freeBetBalance: 20, // Start with GHS 20 free bet
      useFreeBet: false,

      addSelection: (sel) => set((st) => st.selections.find(s => s.id === sel.id) ? st : { selections: [...st.selections, sel] }),
      removeSelection: (id) => set((st) => ({ selections: st.selections.filter(s => s.id !== id) })),
      setStake: (stake) => set({ stake }),
      toggleMode: () => set((st) => ({ mode: st.mode === 'REAL' ? 'SIM' : 'REAL' })),
      clearBetslip: () => set({ selections: [], stake: 0, notification: null, useFreeBet: false }),

      placeBet: (totalOdds, potentialWin) => {
        const { selections, stake, mode, totalWagered, achievements, appliedPromoValue, useFreeBet, freeBetBalance } = get();
        if (selections.length === 0) return;
        
        const actualStake = useFreeBet ? 0 : stake;
        const bonusStake = appliedPromoValue > 0 ? actualStake * (1 + appliedPromoValue) : actualStake;
        
        const newBets: PlacedBet[] = selections.map(sel => ({
          id: Math.random().toString(36).substr(2, 9), matchName: sel.matchName, outcome: sel.outcome,
          odds: sel.odds, stake: bonusStake, potentialWin: useFreeBet ? potentialWin : potentialWin + (appliedPromoValue > 0 ? bonusStake : 0),
          status: useFreeBet ? 'Free Bet' : 'Pending', date: new Date().toLocaleDateString()
        }));

        let newAchievements = [...achievements];
        let msg = null;
        if (!achievements.includes('First Bet Placed')) { newAchievements.push('First Bet Placed'); msg = '🏆 Achievement Unlocked: First Bet Placed!'; }

        set((st) => ({
          betHistory: [...newBets, ...st.betHistory], selections: [], stake: 0, useFreeBet: false,
          totalWagered: totalWagered + bonusStake, 
          freeBetBalance: useFreeBet ? 0 : freeBetBalance, // Consume free bet
          achievements: newAchievements, appliedPromoValue: 0, promoCodeApplied: false,
          notification: msg || `✅ Placed ${useFreeBet ? 'Free ' : ''}bet for GHS ${bonusStake.toFixed(2)}!`
        }));
        setTimeout(() => set({ notification: null }), 4000);
      },

      claimDailyBonus: () => { set({ hasClaimedBonus: true, notification: `🎉 GHS 25.00 Daily Bonus added!` }); setTimeout(() => set({ notification: null }), 4000); },
      cashOutBet: (betId, cashOutValue) => { set((st) => ({ betHistory: st.betHistory.map(b => b.id === betId ? { ...b, status: 'Cashed Out' as const } : b), notification: `✅ Cashed out GHS ${cashOutValue.toFixed(2)}!` })); setTimeout(() => set({ notification: null }), 3000); },
      toggleQuickBet: () => set((st) => ({ quickBetEnabled: !st.quickBetEnabled })),
      setQuickBetStake: (stake) => set({ quickBetStake: stake }),
      
      quickPlaceBet: (selection) => {
        const { quickBetStake, mode, betHistory, totalWagered, achievements, isCoolOffActive } = get();
        if (isCoolOffActive) { set({ notification: '🔒 Account is in Cool-Off.' }); setTimeout(() => set({ notification: null }), 3000); return; }
        let newAchievements = [...achievements];
        if (!achievements.includes('First Bet Placed')) newAchievements.push('First Bet Placed');
        set({
          betHistory: [{ id: Math.random().toString(36).substr(2, 9), matchName: selection.matchName, outcome: selection.outcome, odds: selection.odds, stake: quickBetStake, potentialWin: quickBetStake * selection.odds, status: 'Pending', date: new Date().toLocaleDateString() }, ...betHistory],
          totalWagered: totalWagered + quickBetStake, achievements: newAchievements,
          notification: `⚡ Quick Bet Placed!`
        });
        setTimeout(() => set({ notification: null }), 4000);
      },

      addAchievement: (badge) => set((st) => st.achievements.includes(badge) ? st : { achievements: [...st.achievements, badge], notification: `🏆 Unlocked: ${badge}!` }),
      applyPromoCode: (code) => {
        const validCodes: Record<string, number> = { 'WELCOME50': 0.50, 'BETNOVA10': 0.10 };
        const bonus = validCodes[code.toUpperCase()];
        if (!bonus) { set({ notification: '🚫 Invalid promo code.' }); setTimeout(() => set({ notification: null }), 3000); return; }
        set({ promoCodeApplied: true, appliedPromoValue: bonus, notification: `✅ Promo applied! +${bonus * 100}% bonus.` });
        setTimeout(() => set({ notification: null }), 3000);
      },
      activateCoolOff: (hours) => {
        const until = Date.now() + (hours * 60 * 60 * 1000);
        set({ isCoolOffActive: true, coolOffUntil: until, notification: `🔒 Cool-Off activated for ${hours}h.` });
        setTimeout(() => set({ notification: null }), 4000);
      },
      deactivateCoolOff: () => set({ isCoolOffActive: false, coolOffUntil: null, notification: '🔓 Betting restored.' }),
      setCurrency: (currency) => set({ currency }),
      toggleFavorite: (matchId) => set((st) => ({ favorites: st.favorites.includes(matchId) ? st.favorites.filter(id => id !== matchId) : [...st.favorites, matchId] })),
      
      setTransactionPin: (pin) => set({ transactionPin: pin }),
      toggleFreeBet: () => set((st) => ({ useFreeBet: !st.useFreeBet, stake: st.useFreeBet ? st.stake : 0 })),
      addFreeBet: (amount) => set((st) => ({ freeBetBalance: st.freeBetBalance + amount })),
      
      loadBookingCode: (code) => {
        const picks = bookingCodes[code.toUpperCase()];
        if (!picks) { set({ notification: '🚫 Invalid Booking Code.' }); setTimeout(() => set({ notification: null }), 3000); return; }
        set((st) => ({ selections: [...picks], notification: `✅ Booking Code ${code.toUpperCase()} loaded!` }));
        setTimeout(() => set({ notification: null }), 3000);
      }
    }),
    { name: 'betnova-betslip-storage' }
  )
);
