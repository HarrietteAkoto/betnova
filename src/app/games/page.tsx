"use client";

import Link from "next/link";
import { ArrowLeft, Gamepad2, Clock, Trophy } from "lucide-react";

const virtualGames = [
  { id: 1, name: "Virtual Soccer", icon: "⚽", nextRace: "2 mins", color: "from-green-600 to-green-800" },
  { id: 2, name: "Virtual Greyhounds", icon: "🐕", nextRace: "1 min", color: "from-blue-600 to-blue-800" },
  { id: 3, name: "Virtual Horse Racing", icon: "🐎", nextRace: "3 mins", color: "from-purple-600 to-purple-800" },
  { id: 4, name: "Virtual Tennis", icon: "🎾", nextRace: "4 mins", color: "from-yellow-600 to-yellow-800" },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-md"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold flex items-center gap-2"><Gamepad2 className="w-5 h-5 text-green-500" /> Virtual Games</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-gradient-to-r from-green-900/40 to-gray-900 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
          <Trophy className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Virtual Sports Available 24/7!</h2>
          <p className="text-gray-400 text-sm">Fast-paced, computer-generated matches with instant results.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {virtualGames.map((game) => (
            <div key={game.id} className={`bg-gradient-to-br ${game.color} rounded-xl p-6 border border-white/10 hover:scale-[1.02] transition-transform cursor-pointer group`}>
              <div className="text-4xl mb-3">{game.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Clock className="w-4 h-4" /> Next event in {game.nextRace}
              </div>
              <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-colors backdrop-blur-sm">
                Play Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
