"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBetslipStore } from "../store/useBetslipStore";
import { 
  Home, Ticket, User, Soccer, Monitor, Basketball, Tennis, Table2, IceHockey, Hand, MoreHorizontal,
  Trophy, Timer, Calendar, Grid3X3, Activity, History, Gift, Star, Smartphone, Globe,
  ChevronDown, ChevronUp, CheckSquare, X, Lock, Flame, Award, ClipboardList, BarChart3, TrendingUp, ArrowLeft, MessageCircle, Share2, Zap, Search, Crown, ShieldAlert, Tag
} from "lucide-react";

// --- SAMPLE DATA ---
const popularMatches = [
  { id: 'p1', league: 'Premier League', home: 'Arsenal', away: 'Liverpool', time: 'Today 20:00', isLive: false, odds: { home: 2.10, draw: 3.40, away: 3.25 } },
  { id: 'p2', league: 'La Liga', home: 'Real Madrid', away: 'Barcelona', time: 'Tomorrow 21:00', isLive: false, odds: { home: 2.45, draw: 3.10, away: 2.80 } },
  { id: 'p3', league: 'Champions League', home: 'Man City', away: 'Bayern', time: "67'", isLive: true, score: '2 - 1', odds: { home: 1.45, draw: 4.50, away: 6.00 } },
];

const jackpotMatches = Array.from({ length: 12 }, (_, i) => ({
  id: `j${i}`, home: `Team A${i}`, away: `Team B${i}`, time: 'Sat 15:00', odds: { home: 1.90, draw: 3.20, away: 3.80 }
}));

const liveScores = [
  { id: 's1', home: 'Dortmund', away: 'Leipzig', score: '1 - 0', minute: "42'" },
  { id: 's2', home: 'PSG', away: 'Marseille', score: '3 - 1', minute: "78'" },
];

export default function Home() {
  const { selections, addSelection, removeSelection, stake, setStake, totalOdds, potentialWin, placeBet, walletBalance, transactionPin, freeBetBalance, useFreeBet, toggleFreeBet, loadBookingCode, generateBookingCode, bookingCode, setBookingCode } = useBetslipStore();
  
  const [activeTopNav, setActiveTopNav] = useState<string>('Sports');
  const [activeSport, setActiveSport] = useState<string>('Football');
  const [activeMarketTab, setActiveMarketTab] = useState<'markets' | 'stats' | 'codes'>('markets');
  const [activeMarketFilter, setActiveMarketFilter] = useState<'all' | 'main' | 'goals' | 'corners' | 'half' | 'players'>('all');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit' }));
  
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCoolOffModalOpen, setIsCoolOffModalOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authGhanaCard, setAuthGhanaCard] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOddClick = (matchId: string, matchName: string, market: string, outcome: string, odds: number) => {
    const id = `${matchId}-${market}-${outcome}`;
    const selection = { id, matchId, matchName, market, outcome, odds };
    const exists = selections.find(s => s.id === id);
    if (exists) removeSelection(id);
    else addSelection(selection);
  };

  const initiateBet = () => {
    if (selections.length === 0) return;
    if (!useFreeBet && stake <= 0) { setNotification("Enter a valid stake!"); setTimeout(() => setNotification(null), 2000); return; }
    if (!useFreeBet && stake > walletBalance) { setNotification("Insufficient balance!"); setTimeout(() => setNotification(null), 2000); return; }
    setIsPinModalOpen(true); setPinInput("");
  };

  const confirmBet = () => {
    if (pinInput !== transactionPin) { setNotification("Incorrect PIN!"); setTimeout(() => setNotification(null), 2000); return; }
    setIsPinModalOpen(false);
    placeBet(totalOdds, potentialWin);
    setNotification("✅ Bet Placed Successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'register' && !showOtpStep) { setShowOtpStep(true); setNotification("📱 OTP sent!"); setTimeout(() => setNotification(null), 3000); return; }
    if (authTab === 'forgot') { setNotification("✅ Reset link sent!"); setTimeout(() => { setNotification(null); setAuthTab('login'); setShowOtpStep(false); }, 2000); return; }
    localStorage.setItem('betnova_logged_in', 'true'); setIsAuthOpen(false); setAuthTab('login'); setShowOtpStep(false);
    setNotification("✅ Welcome back!"); setTimeout(() => setNotification(null), 3000);
  };

  const renderTopNavContent = () => {
    switch (activeTopNav) {
      case 'Sports':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            {popularMatches.map(m => (
              <div key={m.id} className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
                <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-gray-400">{m.league}</span>
                  <div className="flex items-center gap-2">
                    {m.isLive && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE {m.time}</span>}
                    {!m.isLive && <span className="text-xs text-gray-400">{m.time}</span>}
                    <Flame className="w-3 h-3 text-orange-500" />
                  </div>
                </div>
                
                {/* Tabbed Interface */}
                <div className="flex border-b border-gray-800 bg-[#151515]">
                  {(['markets', 'stats', 'codes'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveMarketTab(tab)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 ${activeMarketTab === tab ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-500'}`}>
                      {tab === 'markets' && <TrendingUp className="w-3 h-3" />}
                      {tab === 'stats' && <BarChart3 className="w-3 h-3" />}
                      {tab === 'codes' && <ClipboardList className="w-3 h-3" />}
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-white">{m.home}</span>
                    <span className="text-[#00e676] font-bold">{m.isLive ? m.score : 'VS'}</span>
                    <span className="font-bold text-white">{m.away}</span>
                  </div>

                  {activeMarketTab === 'markets' && (
                    <div className="space-y-3">
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                        {(['all', 'main', 'goals', 'corners', 'half', 'players'] as const).map(f => (
                          <button key={f} onClick={() => setActiveMarketFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${activeMarketFilter === f ? 'bg-[#00e676] text-black' : 'bg-[#2a2a2a] text-gray-400'}`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </button>
                        ))}
                      </div>

                      {(activeMarketFilter === 'all' || activeMarketFilter === 'main') && (
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, '1X2', m.home, m.odds.home)} className={`py-2 rounded text-sm font-bold transition-colors ${selections.some(s => s.matchId === m.id && s.outcome === m.home) ? 'bg-[#00e676] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}>1 <span className="block text-[#ffeb3b]">{m.odds.home.toFixed(2)}</span></button>
                          <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, '1X2', 'Draw', m.odds.draw)} className={`py-2 rounded text-sm font-bold transition-colors ${selections.some(s => s.matchId === m.id && s.outcome === 'Draw') ? 'bg-[#00e676] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}>X <span className="block text-[#ffeb3b]">{m.odds.draw.toFixed(2)}</span></button>
                          <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, '1X2', m.away, m.odds.away)} className={`py-2 rounded text-sm font-bold transition-colors ${selections.some(s => s.matchId === m.id && s.outcome === m.away) ? 'bg-[#00e676] text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}>2 <span className="block text-[#ffeb3b]">{m.odds.away.toFixed(2)}</span></button>
                        </div>
                      )}

                      {(activeMarketFilter === 'all' || activeMarketFilter === 'goals') && (
                        <div className="bg-[#0a0a0a] rounded p-2 border border-gray-800">
                          <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase text-center">Over / Under 2.5 Goals</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, 'O/U', 'Over 2.5', 1.85)} className="py-2 rounded text-xs font-bold bg-[#2a2a2a] text-white hover:bg-[#333] flex justify-between px-3"><span>Over 2.5</span><span className="text-[#ffeb3b]">1.85</span></button>
                            <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, 'O/U', 'Under 2.5', 1.95)} className="py-2 rounded text-xs font-bold bg-[#2a2a2a] text-white hover:bg-[#333] flex justify-between px-3"><span>Under 2.5</span><span className="text-[#ffeb3b]">1.95</span></button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                             <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, 'BTTS', 'Yes', 1.70)} className="py-2 rounded text-xs font-bold bg-[#2a2a2a] text-white hover:bg-[#333] flex justify-between px-3"><span>GG (Yes)</span><span className="text-[#ffeb3b]">1.70</span></button>
                             <button onClick={() => handleOddClick(m.id, `${m.home} vs ${m.away}`, 'BTTS', 'No', 2.10)} className="py-2 rounded text-xs font-bold bg-[#2a2a2a] text-white hover:bg-[#333] flex justify-between px-3"><span>NG (No)</span><span className="text-[#ffeb3b]">2.10</span></button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeMarketTab === 'stats' && (
                    <div className="text-center py-4 text-gray-400 text-sm">📊 Match statistics and H2H data will appear here.</div>
                  )}

                  {activeMarketTab === 'codes' && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400 mb-3">Share this match as a booking code</p>
                      <button onClick={() => { handleOddClick(m.id, `${m.home} vs ${m.away}`, '1X2', m.home, m.odds.home); setNotification("📋 Added to betslip to generate code!"); setTimeout(() => setNotification(null), 2000); }} className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#00e676] hover:text-black text-white rounded text-xs font-bold transition-colors">
                        Add to Betslip to Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'Live Betting':
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live In-Play</h3>
            {popularMatches.filter(m => m.isLive).map(m => (
              <div key={m.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-red-900/30">
                <div className="flex justify-between text-xs text-gray-400 mb-2"><span>{m.league}</span><span className="text-red-500 font-bold">{m.time}</span></div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-white">{m.home}</span>
                  <span className="text-[#00e676] font-bold text-lg">{m.score}</span>
                  <span className="font-bold text-white">{m.away}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 rounded text-sm font-bold bg-[#2a2a2a] text-white">1 <span className="block text-[#ffeb3b]">{m.odds.home.toFixed(2)}</span></button>
                  <button className="py-2 rounded text-sm font-bold bg-[#2a2a2a] text-white">X <span className="block text-[#ffeb3b]">{m.odds.draw.toFixed(2)}</span></button>
                  <button className="py-2 rounded text-sm font-bold bg-[#2a2a2a] text-white">2 <span className="block text-[#ffeb3b]">{m.odds.away.toFixed(2)}</span></button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Jackpot':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[#ffeb3b] font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Trophy className="w-4 h-4" /> Mega Jackpot (12 Games)</h3>
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
              <div className="grid grid-cols-5 bg-[#2a2a2a] p-2 text-xs font-bold text-gray-400 text-center">
                <span className="col-span-2 text-left">Match</span><span>1</span><span>X</span><span>2</span>
              </div>
              {jackpotMatches.map(m => (
                <div key={m.id} className="grid grid-cols-5 p-2 border-t border-gray-800 text-xs items-center">
                  <div className="col-span-2"><div className="text-white font-medium">{m.home}</div><div className="text-white font-medium">{m.away}</div></div>
                  <button className="p-2 rounded bg-[#2a2a2a] text-[#ffeb3b] font-bold hover:bg-[#333]">{m.odds.home.toFixed(2)}</button>
                  <button className="p-2 rounded bg-[#2a2a2a] text-[#ffeb3b] font-bold hover:bg-[#333]">{m.odds.draw.toFixed(2)}</button>
                  <button className="p-2 rounded bg-[#2a2a2a] text-[#ffeb3b] font-bold hover:bg-[#333]">{m.odds.away.toFixed(2)}</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Livescore':
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[#00e676] font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Live Scores</h3>
            {liveScores.map(m => (
              <div key={m.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-gray-800 flex justify-between items-center">
                <div className="flex-1"><div className="text-white font-bold">{m.home}</div><div className="text-white font-bold">{m.away}</div></div>
                <div className="text-center px-4"><div className="text-[#00e676] font-bold text-lg">{m.score}</div><div className="text-xs text-gray-400">{m.minute}</div></div>
              </div>
            ))}
          </div>
        );
      case 'Promotions':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[#ffeb3b] font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><Gift className="w-4 h-4" /> Promotions</h3>
            <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-4 border border-white/10">
              <h4 className="font-bold text-white text-lg mb-1">100% First Deposit Bonus</h4>
              <p className="text-white/80 text-sm mb-3">Get up to GHS 1,000 extra on your first deposit!</p>
              <button className="px-4 py-2 bg-white text-black font-bold text-xs rounded hover:bg-gray-200 transition-colors">Claim Now</button>
            </div>
          </div>
        );
      case 'Sporty Loyalty':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[#ffeb3b] font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Star className="w-4 h-4" /> Sporty Loyalty</h3>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 text-center">
              <div className="w-16 h-16 bg-[#ffeb3b]/20 rounded-full flex items-center justify-center mx-auto mb-3"><Star className="w-8 h-8 text-[#ffeb3b] fill-[#ffeb3b]" /></div>
              <h4 className="text-white font-bold text-lg">Silver Tier</h4>
              <p className="text-gray-400 text-xs mb-4">1,250 / 5,000 Points to Gold</p>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2"><div className="bg-[#ffeb3b] h-2 rounded-full" style={{ width: '25%' }}></div></div>
              <p className="text-[#00e676] text-xs font-bold">Keep betting to unlock exclusive rewards!</p>
            </div>
          </div>
        );
      case 'App':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[#00e676] font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Get the App</h3>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 text-center">
              <p className="text-gray-300 mb-4">Download the BetNova app for the fastest betting experience.</p>
              <div className="flex flex-col gap-3">
                <button className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"><Smartphone className="w-5 h-5" /> Download for Android</button>
                <button className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"><Smartphone className="w-5 h-5" /> Download for iOS</button>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg inline-block"><Grid3X3 className="w-24 h-24 text-black" /><p className="text-black text-xs font-bold mt-1">Scan QR Code</p></div>
            </div>
          </div>
        );
      case 'GMT+00:00':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Timezone</h3>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-2">Current Server Time (GMT)</p>
              <p className="text-[#00e676] text-4xl font-bold tracking-widest">{currentTime}</p>
            </div>
          </div>
        );
      default:
        return <div className="text-center py-12 text-gray-500">Select a category above.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32">
      {notification && (<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] bg-[#00e676] text-black px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 animate-bounce">{notification}</div>)}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold tracking-tight text-[#00e676]">BET<span className="text-white">NOVA</span></h1>
          <div className="flex items-center gap-3">
            <div className="bg-[#1a1a1a] border border-gray-800 px-3 py-1.5 rounded-md">
              <span className="text-xs text-gray-400">GHS </span>
              <span className="text-sm font-bold text-[#00e676]">{walletBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Top Navigation Bar */}
      <div className="sticky top-14 z-40 bg-[#0a0a0a] border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-2 min-w-max">
          {['Sports', 'Games', 'Live Betting', 'Scheduled Virtuals', 'Jackpot', 'Livescore', 'Results', 'Promotions', 'Sporty Loyalty', 'App', 'GMT+00:00'].map((item) => (
            <button key={item} onClick={() => setActiveTopNav(item)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all min-h-[44px] ${activeTopNav === item ? 'bg-[#00e676] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-gray-800'}`}>
              {item === 'Sports' && <Soccer className="w-3.5 h-3.5" />}
              {item === 'Games' && <Monitor className="w-3.5 h-3.5" />}
              {item === 'Live Betting' && <Timer className="w-3.5 h-3.5" />}
              {item === 'Scheduled Virtuals' && <Calendar className="w-3.5 h-3.5" />}
              {item === 'Jackpot' && <Trophy className="w-3.5 h-3.5" />}
              {item === 'Livescore' && <Activity className="w-3.5 h-3.5" />}
              {item === 'Results' && <History className="w-3.5 h-3.5" />}
              {item === 'Promotions' && <Gift className="w-3.5 h-3.5" />}
              {item === 'Sporty Loyalty' && <Star className="w-3.5 h-3.5" />}
              {item === 'App' && <Smartphone className="w-3.5 h-3.5" />}
              {item === 'GMT+00:00' && <Globe className="w-3.5 h-3.5" />}
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="sticky top-[72px] z-30 bg-[#0a0a0a] border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-3 min-w-max">
          {['Home', 'Football', 'vFootball', 'Basketball', 'Tennis', 'eFootball', 'Table Tennis', 'eBasketball', 'Ice Hockey', 'Handball', 'More Sports'].map((sport) => (
            <button key={sport} onClick={() => setActiveSport(sport)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[60px] min-h-[44px] transition-all ${activeSport === sport ? 'text-[#00e676] bg-[#00e676]/10' : 'text-gray-500 hover:text-gray-300'}`}>
              {sport === 'Football' && <Soccer className="w-5 h-5" />}
              {sport === 'vFootball' && <Monitor className="w-5 h-5" />}
              {sport === 'Basketball' && <Basketball className="w-5 h-5" />}
              {sport === 'Tennis' && <Tennis className="w-5 h-5" />}
              {sport === 'eFootball' && <Monitor className="w-5 h-5" />}
              {sport === 'Table Tennis' && <Table2 className="w-5 h-5" />}
              {sport === 'eBasketball' && <Monitor className="w-5 h-5" />}
              {sport === 'Ice Hockey' && <IceHockey className="w-5 h-5" />}
              {sport === 'Handball' && <Hand className="w-5 h-5" />}
              {sport === 'More Sports' && <MoreHorizontal className="w-5 h-5" />}
              {sport === 'Home' && <Home className="w-5 h-5" />}
              <span className="text-[10px] font-medium whitespace-nowrap">{sport}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area: Expandable Panel */}
      <main className="container mx-auto px-3 py-4 max-w-2xl">
        {renderTopNavContent()}
      </main>

      {/* Sticky Bottom Betslip */}
      {selections.length > 0 && (
        <div className="fixed bottom-16 left-0 w-full bg-[#1a1a1a] border-t border-[#00e676]/30 p-4 z-40 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">{selections.length} Selection(s)</p>
              <p className="text-[#00e676] font-bold text-lg">GHS {potentialWin.toFixed(2)}</p>
            </div>
            <button onClick={() => {}} className="px-6 py-2.5 bg-[#00e676] text-black rounded-md font-bold text-sm hover:bg-[#00cc6a] transition-colors min-h-[44px]">
              View Betslip
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#1a1a1a] border-t border-gray-800 z-50 pb-safe">
        <div className="container mx-auto max-w-lg flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-1 text-[#00e676] min-h-[44px] justify-center w-full"><Home className="w-6 h-6" /><span className="text-[10px] font-bold">Home</span></Link>
          <Link href="/my-bets" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#00e676] transition-colors min-h-[44px] justify-center w-full"><Ticket className="w-6 h-6" /><span className="text-[10px] font-bold">My Bets</span></Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#00e676] transition-colors min-h-[44px] justify-center w-full"><User className="w-6 h-6" /><span className="text-[10px] font-bold">Profile</span></Link>
        </div>
      </nav>

      {/* Transaction PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPinModalOpen(false)} />
          <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <Lock className="w-12 h-12 text-[#00e676] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Enter Transaction PIN</h2>
            <input type="password" maxLength={4} value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} placeholder="****" className="flex h-14 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-2xl text-white text-center tracking-[1em] focus:outline-none focus:ring-2 focus:ring-[#00e676] mb-4" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => setIsPinModalOpen(false)} className="flex-1 h-11 bg-gray-800 text-gray-300 rounded-md font-bold hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={confirmBet} className="flex-1 h-11 bg-[#00e676] text-black rounded-md font-bold hover:bg-[#00cc6a] transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setIsAuthOpen(false); setShowOtpStep(false); setAuthTab('login'); }} />
          <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => { setIsAuthOpen(false); setShowOtpStep(false); setAuthTab('login'); }} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            {showOtpStep ? (
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-[#00e676] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Verify OTP</h2>
                <input type="text" maxLength={6} value={authOtp} onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="flex h-14 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-2xl text-white text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#00e676] mb-6" autoFocus />
                <button onClick={handleAuthSubmit} className="w-full h-11 bg-[#00e676] text-black rounded-md font-bold text-base hover:bg-[#00cc6a] transition-colors">Verify & Continue</button>
              </div>
            ) : authTab === 'forgot' ? (
              <div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">Forgot Password</h2>
                <form onSubmit={handleAuthSubmit} className="space-y-4 mt-4">
                  <div><label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label><input type="tel" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="024XXXXXXX" className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00e676]" required /></div>
                  <button type="submit" className="w-full h-11 bg-[#00e676] text-black rounded-md font-bold text-base hover:bg-[#00cc6a] transition-colors mt-2">Send Reset Code</button>
                </form>
                <button onClick={() => setAuthTab('login')} className="w-full mt-4 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to Login</button>
              </div>
            ) : (
              <div>
                <div className="flex border-b border-gray-800 mb-6">
                  <button onClick={() => setAuthTab('login')} className={`flex-1 pb-3 text-sm font-bold transition-colors ${authTab === 'login' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}>Log In</button>
                  <button onClick={() => setAuthTab('register')} className={`flex-1 pb-3 text-sm font-bold transition-colors ${authTab === 'register' ? 'text-[#00e676] border-b-2 border-[#00e676]' : 'text-gray-400 hover:text-white'}`}>Register</button>
                </div>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authTab === 'register' && (
                    <>
                      <div><label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label><input type="text" placeholder="Kwame Mensah" className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00e676]" required /></div>
                      <div><label className="block text-xs font-medium text-gray-400 mb-1">Ghana Card Number (NIA)</label><input type="text" value={authGhanaCard} onChange={(e) => setAuthGhanaCard(e.target.value.toUpperCase())} placeholder="GHA-123456789-0" className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-[#00e676]" required /></div>
                    </>
                  )}
                  <div><label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label><input type="tel" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="024XXXXXXX" className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00e676]" required /></div>
                  <div><label className="block text-xs font-medium text-gray-400 mb-1">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00e676]" required /></div>
                  {authTab === 'login' && (<div className="text-right"><button type="button" onClick={() => setAuthTab('forgot')} className="text-xs text-[#00e676] hover:text-[#00cc6a]">Forgot Password?</button></div>)}
                  <button type="submit" className="w-full h-11 bg-[#00e676] text-black rounded-md font-bold text-base hover:bg-[#00cc6a] transition-colors mt-2">{authTab === 'register' ? 'Create Account' : 'Log In'}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDepositOpen(false)} />
          <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => setIsDepositOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-white mb-2">Deposit Funds</h2>
            <div className="bg-[#00e676]/10 border border-[#00e676]/30 rounded-lg p-3 mb-4 flex items-center gap-3">
              <Gift className="w-6 h-6 text-[#00e676] flex-shrink-0" />
              <div><p className="text-sm font-bold text-[#00e676]">🎁 50% First Deposit Bonus!</p><p className="text-xs text-gray-400">Deposit GHS 100, get GHS 150 in your wallet.</p></div>
            </div>
            <div className="mb-4"><label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Promo Code</label><div className="flex gap-2"><input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. WELCOME50" className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-[#00e676]" /><button className="h-10 px-4 bg-[#00e676] text-black rounded-md font-bold text-xs hover:bg-[#00cc6a]">Apply</button></div></div>
            <div className="grid grid-cols-3 gap-2 mb-4">{[10, 50, 100, 200, 500, 1000].map((amt) => (<button key={amt} onClick={() => setDepositAmount(amt)} className={`py-2 rounded-md font-bold border transition-colors ${depositAmount === amt ? 'bg-[#00e676] border-[#00e676] text-black' : 'bg-[#0a0a0a] border-gray-700 text-white hover:border-[#00e676]'}`}>GHS {amt}</button>))}</div>
            <div className="mb-6"><label className="block text-xs font-medium text-gray-400 mb-1">Custom Amount</label><input type="number" value={depositAmount || ''} onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)} className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00e676]" /></div>
            <button onClick={() => { setDepositAmount(0); setIsDepositOpen(false); }} className="w-full h-11 bg-[#00e676] text-black rounded-md font-bold text-base hover:bg-[#00cc6a] transition-colors">Confirm Deposit</button>
          </div>
        </div>
      )}

      {/* Cool-Off Modal */}
      {isCoolOffModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCoolOffModalOpen(false)} />
          <div className="relative bg-[#1a1a1a] border-2 border-red-500/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Self-Exclusion / Cool-Off</h2>
            <p className="text-sm text-gray-400 mb-6">Temporarily lock your account to play responsibly.</p>
            <div className="grid grid-cols-3 gap-2 mb-4">{[{h:24, l:'24h'}, {h:168, l:'7 Days'}, {h:720, l:'30 Days'}].map((c) => (<button key={c.h} onClick={() => { setIsCoolOffModalOpen(false); }} className="py-2 rounded-md font-bold bg-gray-800 text-white hover:bg-red-500 transition-colors">{c.l}</button>))}</div>
            <button onClick={() => setIsCoolOffModalOpen(false)} className="w-full h-11 bg-[#00e676] text-black rounded-md font-bold text-base hover:bg-[#00cc6a] transition-colors mb-2">Unlock Early</button>
            <button onClick={() => setIsCoolOffModalOpen(false)} className="w-full h-11 bg-gray-800 text-gray-300 rounded-md font-bold text-base hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
        {isChatOpen && (
          <div className="mb-4 w-80 h-96 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#00e676] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div><h3 className="font-bold text-black text-sm">BetNova Support</h3></div>
              <button onClick={() => setIsChatOpen(false)} className="text-black/80 hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0a0a]">
              <div className="bg-[#2a2a2a] text-white text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">👋 Hi Harriette! Welcome to BetNova. How can we help you today?</div>
            </div>
            <div className="p-3 border-t border-gray-800 bg-[#1a1a1a]">
              <div className="flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 h-9 rounded-md bg-[#0a0a0a] border border-gray-700 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00e676]" />
                <button className="h-9 px-3 bg-[#00e676] text-black rounded-md font-bold text-xs hover:bg-[#00cc6a]">Send</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-[#00e676] text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#00cc6a] transition-all hover:scale-110">{isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}</button>
      </div>
    </div>
  );
}
