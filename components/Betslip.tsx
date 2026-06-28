"use client";
import { useState, useEffect } from "react";
import { X, Ticket, Share2, Lock } from "lucide-react";
// IMPORTANT: If you get an error on the line below, change the path to wherever your store is located (e.g., '../store/useBetslipStore')
import { useBetslipStore } from "@/app/store/useBetslipStore"; 

interface BetslipProps {
  formatMoney: (amount: number) => string;
  isCoolOffActive: boolean;
  initiatePlaceBet: () => void;
  setNotification: (msg: string) => void;
}

export function Betslip({ formatMoney, isCoolOffActive, initiatePlaceBet, setNotification }: BetslipProps) {
  const { 
    selections, stake, setStake, removeSelection, clearBetslip, 
    loadBookingCode, generateBookingCode, freeBetBalance, useFreeBet, toggleFreeBet 
  } = useBetslipStore();

  const [bookingCode, setBookingCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = stake * totalOdds;

  useEffect(() => { setGeneratedCode(null); }, [selections]);

  return (
    <aside id="mobile-betslip" className="lg:col-span-3">
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 lg:sticky lg:top-36">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          Betslip {selections.length > 0 && <span className="bg-green-500 text-gray-950 text-xs px-2 py-0.5 rounded-full font-bold">{selections.length}</span>}
        </h3>
        
        <div className="mb-4 p-3 bg-gray-950 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2"><Ticket className="w-4 h-4 text-green-500" /><span className="text-xs font-bold text-white">Load Booking Code</span></div>
          <div className="flex gap-2">
            <input type="text" value={bookingCode} onChange={(e) => setBookingCode(e.target.value.toUpperCase())} placeholder="e.g. WC2026" className="flex-1 h-8 rounded bg-gray-900 border border-gray-800 text-xs text-white px-2 uppercase" />
            <button onClick={() => loadBookingCode(bookingCode)} className="h-8 px-3 bg-green-600 text-white rounded text-xs font-bold">Load</button>
          </div>
        </div>

        <div className="space-y-3 mb-4 min-h-[100px]">
          {selections.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">Click an odd to add</p>
          ) : (
            selections.map(sel => (
              <div key={sel.id} className="bg-gray-950 p-3 rounded border border-gray-800 relative">
                <button onClick={() => removeSelection(sel.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                <span className="text-xs text-gray-500">{sel.market}</span>
                <p className="text-sm font-medium text-white mb-1">{sel.matchName}</p>
                <p className="text-xs text-gray-400 mb-2">{sel.outcome}</p>
                <span className="text-green-500 font-bold">{sel.odds.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {selections.length > 0 && (
          <div className="space-y-3 border-t border-gray-800 pt-4">
            <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
              {generatedCode ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-900 border border-green-500/30 rounded p-2 text-center">
                    <p className="text-lg font-bold text-green-400 tracking-wider">{generatedCode}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(generatedCode); setNotification("Copied!"); setTimeout(() => setNotification(null), 2000); }} className="h-12 px-3 bg-green-600 text-white rounded text-xs font-bold">Copy</button>
                </div>
              ) : (
                <button onClick={() => setGeneratedCode(generateBookingCode())} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                  <Share2 className="w-3 h-3" /> Generate Code
                </button>
              )}
            </div>

            {freeBetBalance > 0 && (
              <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-xs font-bold text-green-400">Use Free Bet (GHS {freeBetBalance.toFixed(2)})</span>
                <button onClick={toggleFreeBet} className={`w-10 h-5 rounded-full relative ${useFreeBet ? 'bg-green-500' : 'bg-gray-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${useFreeBet ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            )}

            {!useFreeBet && (
              <>
                <div className="flex gap-2">
                  {[10,50,100].map(a => (<button key={a} onClick={() => setStake(a)} className="flex-1 py-1 text-xs font-bold bg-gray-800 text-gray-300 rounded">GHS {a}</button>))}
                </div>
                <input type="number" placeholder="0.00" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white text-right font-bold" value={stake === 0 ? '' : stake} onChange={(e) => setStake(parseFloat(e.target.value) || 0)} />
              </>
            )}

            <div className="flex justify-between text-sm"><span className="text-gray-400">Total Odds:</span><span className="text-white font-bold">{totalOdds.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Potential Win:</span><span className="text-green-500 font-bold">{formatMoney(potentialWin)}</span></div>
            <button disabled={isCoolOffActive} className={`w-full h-12 px-8 rounded-md font-bold text-base transition-colors ${isCoolOffActive ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-gray-950 hover:bg-green-600'}`} onClick={initiatePlaceBet}>
              <Lock className="w-4 h-4 inline mr-2" /> {isCoolOffActive ? 'Cool-Off Active' : 'Place Bet'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
