"use client";
import { useState, useEffect } from "react";
import { useBetslipStore } from "@/store/useBetslipStore"; // Note: Change to "../store/useBetslipStore" if you get an error here
import { Search, Trophy, User } from "lucide-react";

// Import our new dedicated components
import { HeroCarousel } from "../../components/HeroCarousel";
import { MatchCard, MatchData } from "../../components/MatchCard";
import { Betslip } from "../../components/Betslip";

// Mock Data (Keep your real data here or move it to a separate data.ts file later)
const initialMatches: MatchData[] = [
  {
    id: "1", home: "Real Madrid", away: "Barcelona", score: "2 - 1", status: "67' LIVE", isLive: true, sport: "soccer",
    stats: "Real Madrid dominating possession", form: { home: "WWDWL", away: "WDWLW" },
    markets: {
      main: {
        home: { id: "1h", matchId: "1", matchName: "Real Madrid vs Barcelona", market: "Match Winner", outcome: "Real Madrid", odds: 1.85 },
        draw: { id: "1d", matchId: "1", matchName: "Real Madrid vs Barcelona", market: "Match Winner", outcome: "Draw", odds: 3.40 },
        away: { id: "1a", matchId: "1", matchName: "Real Madrid vs Barcelona", market: "Match Winner", outcome: "Barcelona", odds: 4.20 }
      },
      extra: {
        over: { id: "1o", matchId: "1", matchName: "Real Madrid vs Barcelona", market: "Total Goals", outcome: "Over 2.5", odds: 1.65 },
        under: { id: "1u", matchId: "1", matchName: "Real Madrid vs Barcelona", market: "Total Goals", outcome: "Under 2.5", odds: 2.20 },
        btts: { id: "1b", matchId: "1", matchName: "Real Madrid vs Barcelona", market: "BTTS", outcome: "Yes", odds: 1.55 }
      }
    }
  },
  {
    id: "2", home: "Manchester City", away: "Liverpool", score: "0 - 0", status: "34' LIVE", isLive: true, sport: "soccer",
    stats: "Evenly contested match", form: { home: "WWWWW", away: "WDWWL" },
    markets: {
      main: {
        home: { id: "2h", matchId: "2", matchName: "Man City vs Liverpool", market: "Match Winner", outcome: "Man City", odds: 2.10 },
        draw: { id: "2d", matchId: "2", matchName: "Man City vs Liverpool", market: "Match Winner", outcome: "Draw", odds: 3.25 },
        away: { id: "2a", matchId: "2", matchName: "Man City vs Liverpool", market: "Match Winner", outcome: "Liverpool", odds: 3.50 }
      }
    }
  },
  {
    id: "3", home: "Lakers", away: "Celtics", score: "88 - 92", status: "Q4 02:15", isLive: true, sport: "basketball",
    stats: "Celtics on a 10-0 run", form: { home: "WLWWL", away: "WWWDW" },
    markets: {
      main: {
        home: { id: "3h", matchId: "3", matchName: "Lakers vs Celtics", market: "Moneyline", outcome: "Lakers", odds: 2.40 },
        draw: { id: "3d", matchId: "3", matchName: "Lakers vs Celtics", market: "Moneyline", outcome: "Draw", odds: 15.00 },
        away: { id: "3a", matchId: "3", matchName: "Lakers vs Celtics", market: "Moneyline", outcome: "Celtics", odds: 1.60 }
      }
    }
  }
];

const recentWinners = ["🔥 024***456 just won GHS 4,500 on Real Madrid!", "🎉 050***789 cashed out GHS 1,200 on Lakers!", "💰 020***112 hit the jackpot on Man City!"];
const liveCommentary = ["67' ⚽ GOAL! Real Madrid takes the lead!", "65' 🟨 Yellow card for Rodri.", "62' 🔄 Substitution for Barcelona."];

export default function Home() {
  const { selections, addSelection, isCoolOffActive } = useBetslipStore();
  
  // UI State
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all'|'live'|'soccer'|'basketball'>('all');
  const [activeTopNav, setActiveTopNav] = useState('Sports');
  const [activeMarketTab, setActiveMarketTab] = useState<'markets'|'stats'|'codes'>('markets');
  const [activeMarketFilter, setActiveMarketFilter] = useState<'all'|'main'|'goals'|'corners'|'half'|'players'>('all');
  const [commentaryIndex, setCommentaryIndex] = useState(0);
  const [matches] = useState<MatchData[]>(initialMatches);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [walletBalance] = useState(1500);
  
  const currency = "GHS";
  const formatMoney = (amount: number) => `${currency} ${amount.toFixed(2)}`;
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  
  const initiatePlaceBet = () => {
    if (selections.length === 0) return;
    setNotification("Bet placed successfully! 🎉");
    setTimeout(() => setNotification(null), 3000);
  };

  // Effects
  useEffect(() => { 
    const i = setInterval(() => setCommentaryIndex(p => (p + 1) % liveCommentary.length), 8000); 
    return () => clearInterval(i); 
  }, []);

  // Filter logic
  const filtered = matches.filter(m => 
    (m.home.toLowerCase().includes(searchQuery.toLowerCase()) || m.away.toLowerCase().includes(searchQuery.toLowerCase())) && 
    (activeFilter === 'all' || (activeFilter === 'live' && m.isLive) || (activeFilter === 'soccer' && m.sport === 'soccer') || (activeFilter === 'basketball' && m.sport === 'basketball'))
  ).sort((a,b) => (favorites.includes(b.id)?1:0) - (favorites.includes(a.id)?1:0));

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24 lg:pb-0">
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 25s linear infinite; }`}</style>
      
      {notification && <div className="fixed top-20 right-4 z-[110] bg-green-500 text-gray-950 px-6 py-3 rounded-lg shadow-xl font-bold animate-bounce">{notification}</div>}

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">BET<span className="text-white">NOVA</span></h1>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-green-500">{formatMoney(walletBalance)}</span>
             <button className="p-2 bg-gray-800 rounded-lg"><User className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="bg-green-900/20 border-b border-green-500/20 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...recentWinners, ...recentWinners].map((w, i) => (
            <span key={i} className="mx-8 text-sm font-medium text-green-400 flex items-center gap-2"><Trophy className="w-4 h-4" /> {w}</span>
          ))}
        </div>
      </div>

      {/* TOP NAVIGATION */}
      <div className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-2 min-w-max">
          {['Sports','Games','Live Betting','Jackpot','Livescore','Promotions'].map(item => (
            <button key={item} onClick={() => setActiveTopNav(item)} className={`px-4 py-2.5 rounded-full text-xs font-bold ${activeTopNav === item ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-9 space-y-6">
          {activeTopNav === 'Sports' ? (
            <>
              <HeroCarousel />
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[{id:'all',label:'🔥 All'},{id:'live',label:'🔴 Live'},{id:'soccer',label:'⚽ Soccer'},{id:'basketball',label:'🏀 Basketball'}].map(f => (
                  <button key={f.id} onClick={() => setActiveFilter(f.id as any)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeFilter === f.id ? 'bg-green-500 text-gray-950' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}>{f.label}</button>
                ))}
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Search teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {filtered.length > 0 ? (
                filtered.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    favorites={favorites} 
                    toggleFavorite={toggleFavorite} 
                    activeMarketTab={activeMarketTab} 
                    setActiveMarketTab={setActiveMarketTab} 
                    activeMarketFilter={activeMarketFilter} 
                    setActiveMarketFilter={setActiveMarketFilter} 
                    liveCommentary={liveCommentary} 
                    commentaryIndex={commentaryIndex} 
                    addSelection={addSelection} 
                    setNotification={setNotification} 
                  />
                ))
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">No matches found.</div>
              )}
            </>
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
              Content for {activeTopNav} goes here...
            </div>
          )}
        </section>
        
        {/* BETSLIP */}
        <Betslip 
          formatMoney={formatMoney} 
          isCoolOffActive={isCoolOffActive} 
          initiatePlaceBet={initiatePlaceBet} 
          setNotification={setNotification} 
        />
      </main>
    </div>
  );
}
