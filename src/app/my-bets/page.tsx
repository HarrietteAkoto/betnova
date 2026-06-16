"use client";

import { useState } from "react";
import Link from "next/link";
import { useBetslipStore, type PlacedBet } from "../../store/useBetslipStore";
import { Clock, CheckCircle, XCircle, RefreshCcw, Trophy, ChevronDown, ChevronUp } from "lucide-react";

export default function MyBetsPage() {
  const { betHistory = [], cashOutBet } = useBetslipStore();
  const [activeTab, setActiveTab] = useState<"open" | "settled">("open");
  const [openCashOutId, setOpenCashOutId] = useState<string | null>(null);
  const [cashOutPercent, setCashOutPercent] = useState(100);

  const openBets = betHistory.filter(bet => bet.status === "Pending");
  const settledBets = betHistory.filter(bet => bet.status !== "Pending");

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">BET<span className="text-white">NOVA</span></h1>
          <Link href="/" className="ml-8 text-sm font-medium text-gray-400 hover:text-green-500 transition-colors flex items-center gap-1">← Back to Live Matches</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Trophy className="w-6 h-6 text-green-500" /> My Bets</h2>

        <div className="flex gap-4 mb-6 border-b border-gray-800">
          <button onClick={() => setActiveTab("open")} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "open" ? "text-green-500" : "text-gray-500 hover:text-gray-300"}`}>
            Open Bets {openBets.length > 0 && `(${openBets.length})`}
            {activeTab === "open" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
          </button>
          <button onClick={() => setActiveTab("settled")} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === "settled" ? "text-green-500" : "text-gray-500 hover:text-gray-300"}`}>
            Settled Bets
            {activeTab === "settled" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />}
          </button>
        </div>

        {(activeTab === "open" ? openBets : settledBets).length === 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No {activeTab} bets found.</p>
            {activeTab === "open" && <Link href="/" className="text-green-500 font-bold hover:underline">Go place a bet!</Link>}
          </div>
        )}

        {(activeTab === "open" ? openBets : settledBets).length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-500 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Match</th>
                  <th className="px-6 py-4 font-medium">Selection</th>
                  <th className="px-6 py-4 font-medium">Odds</th>
                  <th className="px-6 py-4 font-medium">Stake</th>
                  <th className="px-6 py-4 font-medium">Potential Win</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  {activeTab === "open" && <th className="px-6 py-4 font-medium">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {(activeTab === "open" ? openBets : settledBets).map((bet: PlacedBet) => {
                  const maxCashOut = bet.potentialWin * 0.75;
                  const currentCashOut = maxCashOut * (cashOutPercent / 100);
                  const isCashOutOpen = openCashOutId === bet.id;

                  return (
                    <tr key={bet.id} className="hover:bg-gray-950/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{bet.matchName}</td>
                      <td className="px-6 py-4 text-gray-400">{bet.outcome}</td>
                      <td className="px-6 py-4 text-green-500 font-bold">{bet.odds.toFixed(2)}</td>
                      <td className="px-6 py-4 text-white">GHS {bet.stake.toFixed(2)}</td>
                      <td className="px-6 py-4 text-green-400 font-bold">GHS {bet.potentialWin.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          bet.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                          bet.status === 'Won' ? 'bg-green-500/20 text-green-500' : 
                          bet.status === 'Cashed Out' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {bet.status === 'Won' && <CheckCircle className="w-3 h-3" />}
                          {bet.status === 'Lost' && <XCircle className="w-3 h-3" />}
                          {bet.status === 'Cashed Out' && <RefreshCcw className="w-3 h-3" />}
                          {bet.status}
                        </span>
                      </td>
                      {activeTab === "open" && (
                        <td className="px-6 py-4">
                          {!isCashOutOpen ? (
                            <button 
                              onClick={() => { setOpenCashOutId(bet.id); setCashOutPercent(100); }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors"
                            >
                              <RefreshCcw className="w-3 h-3" /> Cash Out
                            </button>
                          ) : (
                            <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 w-48 animate-in fade-in zoom-in-95">
                              <p className="text-xs text-gray-400 mb-2">Cash Out Amount: <span className="text-green-500 font-bold">GHS {currentCashOut.toFixed(2)}</span></p>
                              <div className="grid grid-cols-4 gap-1 mb-3">
                                {[25, 50, 75, 100].map((pct) => (
                                  <button 
                                    key={pct} 
                                    onClick={() => setCashOutPercent(pct)}
                                    className={`text-[10px] font-bold py-1 rounded ${cashOutPercent === pct ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                  >
                                    {pct}%
                                  </button>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setOpenCashOutId(null)} className="flex-1 py-1.5 text-xs font-bold bg-gray-800 text-gray-300 rounded hover:bg-gray-700">Cancel</button>
                                <button onClick={() => { cashOutBet(bet.id, currentCashOut); setOpenCashOutId(null); }} className="flex-1 py-1.5 text-xs font-bold bg-green-500 text-gray-950 rounded hover:bg-green-600">Confirm</button>
                              </div>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
