"use client";

import Link from "next/link";
import { useBetslipStore, type PlacedBet } from "../../store/useBetslipStore";
import { Clock, ArrowLeft } from "lucide-react";

export default function MyBetsPage() {
  // We now use the exact PlacedBet type instead of 'any'
  const { betHistory = [] } = useBetslipStore();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            BET<span className="text-white">NOVA</span>
          </h1>
          
          <Link href="/" className="ml-8 text-sm font-medium text-gray-400 hover:text-green-500 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Live Matches
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-green-500" /> My Bets History
        </h2>

        {betHistory.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">You have not placed any bets yet.</p>
            <Link href="/" className="text-green-500 font-bold hover:underline">
              Go to Live Matches to start betting!
            </Link>
          </div>
        ) : (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {betHistory.map((bet: PlacedBet) => (
                  <tr key={bet.id} className="hover:bg-gray-950/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{bet.matchName}</td>
                    <td className="px-6 py-4 text-gray-400">{bet.outcome}</td>
                    <td className="px-6 py-4 text-green-500 font-bold">{bet.odds.toFixed(2)}</td>
                    <td className="px-6 py-4 text-white">GHS {bet.stake.toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-400 font-bold">GHS {bet.potentialWin.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-500">
                        {bet.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}