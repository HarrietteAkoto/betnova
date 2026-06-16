"use client";

import Link from "next/link";
import { ArrowLeft, Gamepad2, Clock, Trophy, Plane, Dices, Car, Target, Grid3X3 } from "lucide-react";

const virtualGames = [
  { 
    id: 1, 
    name: "Virtual Football", 
    icon: "⚽", 
    nextRace: "2 mins", 
    color: "from-green-600 to-emerald-800",
    iconComponent: <Gamepad2 className="w-8 h-8 text-white" />
  },
  { 
    id: 2, 
    name: "Aviator", 
    icon: "✈️", 
    nextRace: "Live Now", 
    color: "from-red-600 to-rose-800",
    iconComponent: <Plane className="w-8 h-8 text-white" />
  },
  { 
    id: 3, 
    name: "Virtual Horse Racing", 
    icon: "🐎", 
    nextRace: "1 min", 
    color: "from-purple-600 to-indigo-800",
    iconComponent: <Trophy className="w-8 h-8 text-white" />
  },
  { 
    id: 4, 
    name: "Virtual Moto GP", 
    icon: "🏍️", 
    nextRace: "3 mins", 
    color: "from-orange-600 to-red-800",
    iconComponent: <Car className="w-8 h-8 text-white" />
  },
  { 
    id: 5, 
    name: "Virtual Basketball", 
    icon: "🏀", 
    nextRace: "4 mins", 
    color: "from-orange-500 to-amber-700",
    iconComponent: <Target className="w-8 h-8 text-white" />
  },
  { 
    id: 6, 
    name: "Lucky Numbers (Keno)", 
    icon: "🎱", 
    nextRace: "Every 3 mins", 
    color: "from-blue-600 to-cyan-800",
    iconComponent: <Dices className="w-8 h-8 text-white" />
  },
  { 
    id: 7, 
    name: "Virtual Roulette", 
    icon: "🎡", 
    nextRace: "Live Now", 
    color: "from-gray-700 to-gray-900",
    iconComponent: <Grid3X3 className="w-8 h-8 text-white" />
  },
  { 
    id: 8, 
    name: "Virtual Greyhounds", 
    icon: "🐕", 
    nextRace: "2 mins", 
    color: "from-sky-600 to-blue-800",
    iconComponent: <Clock className="w-8 h-8 text-white" />
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-green-500" /> Virtual Games & Casino
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-green-900/40 via-gray-900 to-green-900/40 border border-green-500/30 rounded-2xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
          <Trophy className="w-16 h-16 text-green-500 mx-auto mb-4 relative z-10" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">24/7 Instant Action!</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto relative z-10">
            Fast-paced, computer-generated matches and casino games with instant results. No waiting, just winning.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {virtualGames.map((game) => (
            <div 
              key={game.id} 
              className={`bg-gradient-to-br ${game.color} rounded-xl p-6 border border-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
            >
              {/* Live Badge for certain games */}
              {game.nextRace === "Live Now" && (
                <span className="absolute top-3 right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}

              <div className="mb-4 p-3 bg-white/10 rounded-full w-fit backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                {game.iconComponent}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
              
              <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                <Clock className="w-4 h-4" /> 
                <span className={game.nextRace === "Live Now" ? "text-red-400 font-bold" : ""}>
                  {game.nextRace === "Live Now" ? "● Live Now" : `Next event in ${game.nextRace}`}
                </span>
              </div>
              
              <button className="w-full py-2.5 bg-white/20 hover:bg-green-500 hover:text-gray-950 text-white rounded-lg font-bold text-sm transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-green-500">
                Play Now
              </button>
            </div>
          ))}
        </div>

        {/* Responsible Gaming Footer */}
        <div className="mt-12 p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
          <p className="text-xs text-gray-500">
            🎲 Virtual games are generated by a certified Random Number Generator (RNG). 
            <br />18+ Only. Please play responsibly.
          </p>
        </div>
      </main>
    </div>
  );
}
