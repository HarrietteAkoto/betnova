import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Selection {
  id: string;
  matchId: string;
  matchName: string;
  market: string;
  outcome: string;
  odds: number;
}

export interface PlacedBet {
  id: string;
  matchName: string;
  outcome: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'Pending' | 'Won' | 'Lost' | 'Cashed Out';
  date: string;
}

interface BetslipState {
  selections: Selection[];
  stake: number;
  mode: 'REAL' | 'SIM';
  notification: string | null;
  betHistory: PlacedBet[];
  hasClaimedBonus: boolean;
  quickBetEnabled: boolean;
  quickBetStake: number;
  
  addSelection: (selection: Selection) => void;
  removeSelection: (id: string) => void;
  setStake: (stake: number) => void;
  toggleMode: () => void;
  clearBetslip: () => void;
  placeBet: (totalOdds: number, potentialWin: number) => void;
  claimDailyBonus: () => void;
  cashOutBet: (betId: string, cashOutValue: number) => void;
  toggleQuickBet: () => void;
  setQuickBetStake: (stake: number) => void;
  quickPlaceBet: (selection: Selection) => void;
}

export const useBetslipStore = create<BetslipState>()(
  persist(
    (set, get) => ({
      selections: [],
      stake: 0,
      mode: 'REAL',
      notification: null,
      betHistory: [],
      hasClaimedBonus: false,
      quickBetEnabled: false,
      quickBetStake: 10,

      addSelection: (selection) => set((state) => {
        if (state.selections.find(s => s.id === selection.id)) return state;
        return { selections: [...state.selections, selection] };
        // Note: Quick bet logic is handled directly in OddsButton to bypass this
      }),

      removeSelection: (id) => set((state) => ({
        selections: state.selections.filter(s => s.id !== id)
      })),

      setStake: (stake) => set({ stake }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'REAL' ? 'SIM' : 'REAL' })),
      clearBetslip: () => set({ selections: [], stake: 0, notification: null }),

      placeBet: (totalOdds, potentialWin) => {
        const { selections, stake, mode } = get();
        if (selections.length === 0 || stake <= 0) return;
        
        const newBets: PlacedBet[] = selections.map(sel => ({
          id: Math.random().toString(36).substr(2, 9),
          matchName: sel.matchName,
          outcome: sel.outcome,
          odds: sel.odds,
          stake: stake,
          potentialWin: potentialWin,
          status: 'Pending',
          date: new Date().toLocaleDateString()
        }));

        set((state) => ({
          betHistory: [...newBets, ...state.betHistory],
          selections: [],
          stake: 0,
          notification: `✅ Successfully placed ${mode} bet for GHS ${stake.toFixed(2)}!`
        }));
        setTimeout(() => set({ notification: null }), 3000);
      },

      claimDailyBonus: () => {
        set({ 
          hasClaimedBonus: true,
          notification: `🎉 Welcome back, Harriette! GHS 25.00 Daily Bonus added!`
        });
        setTimeout(() => set({ notification: null }), 4000);
      },

      cashOutBet: (betId, cashOutValue) => {
        set((state) => ({
          betHistory: state.betHistory.map(bet => 
            bet.id === betId ? { ...bet, status: 'Cashed Out' as const } : bet
          ),
          notification: `✅ Successfully cashed out GHS ${cashOutValue.toFixed(2)}!`
        }));
        setTimeout(() => set({ notification: null }), 3000);
      },

      toggleQuickBet: () => set((state) => ({ quickBetEnabled: !state.quickBetEnabled })),
      setQuickBetStake: (stake) => set({ quickBetStake: stake }),

      quickPlaceBet: (selection) => {
        const { quickBetStake, mode, betHistory } = get();
        const potentialWin = quickBetStake * selection.odds;
        
        const newBet: PlacedBet = {
          id: Math.random().toString(36).substr(2, 9),
          matchName: selection.matchName,
          outcome: selection.outcome,
          odds: selection.odds,
          stake: quickBetStake,
          potentialWin: potentialWin,
          status: 'Pending',
          date: new Date().toLocaleDateString()
        };

        set({
          betHistory: [newBet, ...betHistory],
          notification: `⚡ Quick Bet Placed! GHS ${quickBetStake} on ${selection.outcome}`
        });
        setTimeout(() => set({ notification: null }), 3000);
      }
    }),
    { name: 'betnova-betslip-storage' }
  )
);
