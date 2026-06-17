"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { OddsButton } from "../features/OddsButton";
import { useBetslipStore } from "../store/useBetslipStore";
import { 
  TrendingUp, User, X, MessageCircle, Share2, BarChart3, Gift, Zap, Search, Trophy, 
  Crown, Users, Copy, Tag, Star, Globe, Gamepad2, Wallet, Ticket, Smartphone, 
  Timer, LayoutGrid, Activity, History, ClipboardList, Home, Target, ArrowLeft, ShieldAlert, Lock
} from "lucide-react";

interface MatchOdds { id: string; matchId: string; matchName: string; market: string; outcome: string; odds: number; }
interface MatchMarkets { main: { home: MatchOdds; draw: MatchOdds; away: MatchOdds }; extra?: { over: MatchOdds; under: MatchOdds; btts: MatchOdds }; special?: { dc1x: MatchOdds; dcx2: MatchOdds; cs: MatchOdds }; }
interface MatchData { id: string; home: string; away: string; score: string; status: string; isLive: boolean; sport: string; stats: string; form: string[]; markets: MatchMarkets; }

const carouselImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80', title: 'UEFA Champions League', subtitle: 'Bet on Europe\'s Elite Clubs' },
  { id: 2, url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', title: 'FIFA World Cup 2026', subtitle: 'Ghana vs Brazil - Special Odds!' },
  { id: 3, url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80', title: 'NBA Playoffs', subtitle: 'Lakers vs Celtics Live Now' },
];

const initialMatches: MatchData[] = [
  { id: 'wc-1', home: 'Ghana', away: 'Brazil', score: 'VS', status: "FIFA World Cup 2026 - Group Stage", isLive: false, sport: 'soccer', form: ['W','W','D','W','L'], stats: "Ghana looking strong.", markets: { main: { home: { id: 'wc-h', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Ghana (1)', odds: 4.50 }, draw: { id: 'wc-d', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.20 }, away: { id: 'wc-a', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Brazil (2)', odds: 1.65 } }, extra: { over: { id: 'wc-o', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.80 }, under: { id: 'wc-u', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: 'wc-b', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.75 } }, special: { dc1x: { id: 'wc-dc1', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Double Chance', outcome: 'Ghana or Draw (1X)', odds: 1.90 }, dcx2: { id: 'wc-dc2', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Double Chance', outcome: 'Brazil or Draw (X2)', odds: 1.25 }, cs: { id: 'wc-cs', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Correct Score', outcome: '1 - 1', odds: 6.50 } } } },
  { id: '1', home: 'Real Madrid', away: 'Manchester City', score: '2 - 1', status: "Champions League - 67'", isLive: true, sport: 'soccer', form: ['W','W','W','D','W'], stats: "Real Madrid has won 4 of their last 5 matches.", markets: { main: { home: { id: '1-1', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45 }, draw: { id: '1-x', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.10 }, away: { id: '1-2', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Man City (2)', odds: 2.80 } }, extra: { over: { id: '1-o', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.85 }, under: { id: '1-u', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: '1-b', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.70 } } } },
  { id: '3', home: 'LA Lakers', away: 'Boston Celtics', score: '88 - 92', status: "NBA - 3rd Qtr", isLive: true, sport: 'basketball', form: ['L','W','W','W','L'], stats: "Celtics are on a 12-0 run.", markets: { main: { home: { id: '3-1', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Lakers (1)', odds: 1.90 }, draw: { id: '3-x', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Draw (X)', odds: 15.00 }, away: { id: '3-2', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Celtics (2)', odds: 1.95 } } } }
];

const recentWinners = ["🔥 024***456 just won GHS 4,500 on Real Madrid!", "🎉 050***789 cashed out GHS 1,200 on Lakers!", "⚽ 020***123 hit a 5-fold Acca for GHS 12,000!", "💰 055***901 just deposited GHS 500 and won big!"];
const expertPicks = [{ id: 'ep-1', matchName: 'Ghana vs Brazil', market: 'Double Chance', outcome: 'Ghana or Draw (1X)', odds: 1.90, confidence: '85%' }];
const liveCommentary = ["67' ⚽ GOAL! Real Madrid takes the lead!", "65' 🟨 Yellow card for Rodri.", "62' 🔄 Substitution: Grealish ON."];
const jackpotMatches = Array.from({ length: 12 }, (_, i) => ({ id: `j${i}`, home: `Team A${i}`, away: `Team B${i}`, time: 'Sat 15:00', odds: { home: 1.90, draw: 3.20, away: 3.80 } }));
const liveScores = [{ id: 's1', home: 'Dortmund', away: 'Leipzig', score: '1 - 0', minute: "42'" }, { id: 's2', home: 'PSG', away: 'Marseille', score: '3 - 1', minute: "78'" }];

export default function Home() {
  const { 
    selections, stake, setStake, removeSelection, clearBetslip, placeBet, 
    claimDailyBonus, hasClaimedBonus, totalWagered, addSelection, isCoolOffActive, 
    applyPromoCode, activateCoolOff, deactivateCoolOff, currency, setCurrency, 
    favorites, toggleFavorite, transactionPin, freeBetBalance, useFreeBet, 
    toggleFreeBet, loadBookingCode, generateBookingCode 
  } = useBetslipStore();
  
  // UI State
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all'|'live'|'soccer'|'basketball'>('all');
  const [activeTopNav, setActiveTopNav] = useState('Sports');
  const [activeMarketTab, setActiveMarketTab] = useState<'markets'|'stats'|'codes'>('markets');
  const [activeMarketFilter, setActiveMarketFilter] = useState<'all'|'main'|'goals'|'corners'|'half'|'players'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [commentaryIndex, setCommentaryIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit' }));
  
  // Betslip State
  const [bookingCode, setBookingCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");

  // Auth & Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login'|'register'|'forgot'>('login');
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authGhanaCard, setAuthGhanaCard] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isCoolOffModalOpen, setIsCoolOffModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // User Data
  const [walletBalance, setWalletBalance] = useState<number>(() => typeof window !== 'undefined' ? parseFloat(localStorage.getItem('betnova_wallet') || '1500') : 1500);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => typeof window !== 'undefined' ? localStorage.getItem('betnova_logged_in') === 'true' : false);
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);

  const formatMoney = (amount: number) => `${currency} ${(amount * { GHS: 1, USD: 0.08, EUR: 0.07 }[currency]).toFixed(2)}`;
  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = stake * totalOdds;
  
  const getVipTier = () => totalWagered >= 2000 ? { name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: <Crown className="w-3 h-3 text-yellow-400" /> } : totalWagered >= 500 ? { name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-300/20', icon: <Crown className="w-3 h-3 text-gray-300" /> } : { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: <Crown className="w-3 h-3 text-orange-400" /> };
  const vipTier = getVipTier();

  // Effects
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_wallet', walletBalance.toString()); }, [walletBalance]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_logged_in', isLoggedIn.toString()); }, [isLoggedIn]);
  useEffect(() => { const i = setInterval(() => setCurrentSlide(p => (p + 1) % carouselImages.length), 4000); return () => clearInterval(i); }, []);
  useEffect(() => { setGeneratedCode(null); }, [selections]);
  useEffect(() => { const i = setInterval(() => setCommentaryIndex(p => (p + 1) % liveCommentary.length), 8000); return () => clearInterval(i); }, []);
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit' })), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (!hasClaimedBonus) { setTimeout(() => { claimDailyBonus(); setWalletBalance(p => p + 25); }, 1500); } }, [hasClaimedBonus, claimDailyBonus]);
  
  useEffect(() => {
    const i = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (!m.isLive) return m;
        const min = parseInt(m.status.match(/\d+/)?.[0] || '0') + 1;
        const fluctuate = (o: number) => Math.max(1.01, parseFloat((o + (Math.random() - 0.5) * 0.1).toFixed(2)));
        return { ...m, status: m.status.replace(/\d+'/, `${min > 90 ? 90 : min}'`), markets: { ...m.markets, main: { home: { ...m.markets.main.home, odds: fluctuate(m.markets.main.home.odds) }, draw: { ...m.markets.main.draw, odds: fluctuate(m.markets.main.draw.odds) }, away: { ...m.markets.main.away, odds: fluctuate(m.markets.main.away.odds) } }, extra: m.markets.extra ? { over: { ...m.markets.extra.over, odds: fluctuate(m.markets.extra.over.odds) }, under: { ...m.markets.extra.under, odds: fluctuate(m.markets.extra.under.odds) }, btts: { ...m.markets.extra.btts, odds: fluctuate(m.markets.extra.btts.odds) } } : undefined } };
      }));
    }, 5000);
    return () => clearInterval(i);
  }, []);

  // Handlers
  const initiatePlaceBet = () => {
    if (selections.length === 0 || (!useFreeBet && (stake <= 0 || stake > walletBalance))) return;
    setIsPinModalOpen(true); 
    setPinInput("");
  };

  const confirmPlaceBet = () => {
    if (pinInput !== transactionPin) {
      setNotification("Incorrect PIN!");
      setTimeout(() => setNotification(null), 2000);
      return;
    }
    setIsPinModalOpen(false);
    if (!useFreeBet) setWalletBalance(p => p - stake);
    placeBet(totalOdds, potentialWin); 
    clearBetslip();
    setNotification("✅ Bet Placed!");
    setTimeout(() => setNotification(null), 2000);
  };

  const handleDeposit = () => { if (depositAmount > 0) { setWalletBalance(p => p + depositAmount * 1.5); setDepositAmount(0); setIsDepositOpen(false); setNotification("✅ Deposit Successful + Bonus!"); setTimeout(() => setNotification(null), 3000); } };
  
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'register' && !showOtpStep) { setShowOtpStep(true); setNotification("📱 OTP Sent!"); setTimeout(() => setNotification(null), 2000); return; }
    setIsLoggedIn(true); localStorage.setItem('betnova_logged_in', 'true'); setIsAuthOpen(false); setAuthTab('login'); setShowOtpStep(false);
    setNotification("✅ Welcome to BetNova!"); setTimeout(() => setNotification(null), 3000);
  };

  // Render Logic for Middle Content
  const renderMiddleContent = () => {
    if (activeTopNav === 'Jackpot') return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-950 p-2 text-xs font-bold text-gray-400 text-center"><span className="col-span-2 text-left">Match</span><span>1</span><span>X</span><span>2</span></div>
        {jackpotMatches.map(m => (
          <div key={m.id} className="grid grid-cols-5 p-2 border-t border-gray-800 text-xs items-center">
            <div className="col-span-2"><div className="text-white">{m.home}</div><div className="text-white">{m.away}</div></div>
            <button className="p-2 rounded bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700">{m.odds.home.toFixed(2)}</button>
            <button className="p-2 rounded bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700">{m.odds.draw.toFixed(2)}</button>
            <button className="p-2 rounded bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700">{m.odds.away.toFixed(2)}</button>
          </div>
        ))}
      </div>
    );
    if (activeTopNav === 'Livescore') return (
      <div className="space-y-3">
        {liveScores.map(m => (
          <div key={m.id} className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex justify-between items-center">
            <div className="flex-1"><div className="text-white font-bold">{m.home}</div><div className="text-white font-bold">{m.away}</div></div>
            <div className="text-center px-4"><div className="text-green-500 font-bold text-lg">{m.score}</div><div className="text-xs text-gray-400">{m.minute}</div></div>
          </div>
        ))}
      </div>
    );
    if (activeTopNav === 'Promotions') return (
      <div className="bg-gradient-to-r from-green-900/40 to-gray-900 border border-green-500/30 rounded-lg p-6 text-center">
        <Gift className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h4 className="font-bold text-white text-2xl mb-2">100% First Deposit Bonus</h4>
        <p className="text-gray-400 mb-4">Get up to GHS 1,000 extra on your first deposit!</p>
        <button onClick={() => setIsDepositOpen(true)} className="px-6 py-3 bg-green-500 text-gray-950 font-bold rounded-lg hover:bg-green-600">Claim Now</button>
      </div>
    );
    if (activeTopNav === 'Sporty Loyalty') return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
        <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 mx-auto mb-3" />
        <h4 className="text-white font-bold text-2xl">Silver Tier</h4>
        <p className="text-gray-400 mb-4">1,250 / 5,000 Points to Gold</p>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-2"><div className="bg-yellow-400 h-3 rounded-full" style={{ width: '25%' }}></div></div>
      </div>
    );
    if (activeTopNav === 'App') return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
        <Smartphone className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h4 className="text-white font-bold text-2xl mb-2">Get the App</h4>
        <button className="w-full py-3 bg-green-500 text-gray-950 font-bold rounded-lg mb-2">Download for Android</button>
        <button className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg">Download for iOS</button>
      </div>
    );
    if (activeTopNav === 'GMT+00:00') return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
        <p className="text-gray-400 mb-2">Current Server Time (GMT)</p>
        <p className="text-green-500 text-5xl font-bold tracking-widest">{currentTime}</p>
      </div>
    );
    if (activeTopNav === 'Live Betting') return (
      <div className="space-y-4">
        {matches.filter(m => m.isLive).map(m => (
          <div key={m.id} className="bg-gray-900 rounded-lg border border-red-900/30 p-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2"><span>{m.status}</span><span className="text-red-500 font-bold">{m.score}</span></div>
            <div className="flex justify-between items-center mb-3"><span className="font-bold text-white">{m.home}</span><span className="font-bold text-white">{m.away}</span></div>
            <div className="grid grid-cols-3 gap-2"><OddsButton selection={m.markets.main.home} /><OddsButton selection={m.markets.main.draw} /><OddsButton selection={m.markets.main.away} /></div>
          </div>
        ))}
      </div>
    );

    // Default: Sports View
    const filtered = matches.filter(m => (m.home.toLowerCase().includes(searchQuery.toLowerCase()) || m.away.toLowerCase().includes(searchQuery.toLowerCase())) && (activeFilter === 'all' || (activeFilter === 'live' && m.isLive) || (activeFilter === 'soccer' && m.sport === 'soccer') || (activeFilter === 'basketball' && m.sport === 'basketball'))).sort((a,b) => (favorites.includes(b.id)?1:0) - (favorites.includes(a.id)?1:0));
    
    return (
      <>
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          {carouselImages.map((img, i) => (
            <div key={img.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{img.title}</h3>
                <p className="text-sm md:text-base text-green-400 font-medium">{img.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[{id:'all',label:'🔥 All'},{id:'live',label:'🔴 Live'},{id:'soccer',label:'⚽ Soccer'},{id:'basketball',label:'🏀 Basketball'}].map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id as any)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeFilter === f.id ? 'bg-green-500 text-gray-950' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}>{f.label}</button>
          ))}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Search teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {filtered.map(match => (
          <div key={match.id} className="bg-gray-900 rounded-lg border border-gray-800 p-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className={match.status.includes("World Cup") ? "text-yellow-400 font-bold" : ""}>{match.status}</span>
              {match.isLive && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-white">{match.home}</p>
                  <button onClick={() => toggleFavorite(match.id)}><Star className={`w-4 h-4 ${favorites.includes(match.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} /></button>
                </div>
                <p className="font-semibold text-white mt-1">{match.away}</p>
              </div>
              <div className={`text-2xl font-bold px-4 ${match.isLive ? 'text-green-500' : 'text-gray-500'}`}>{match.score}</div>
            </div>
            {match.isLive && <div className="bg-gray-950 border border-gray-800 rounded p-2 flex items-center gap-2 text-xs"><span className="text-green-500 font-bold animate-pulse">● LIVE</span><span className="text-gray-400 truncate">{liveCommentary[commentaryIndex]}</span></div>}
            
            <div className="pt-2 border-t border-gray-800">
              <div className="flex gap-4 mb-3 border-b border-gray-800">
                {(['markets','stats','codes'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveMarketTab(tab)} className={`pb-2 text-xs font-bold uppercase flex items-center gap-1 ${activeMarketTab === tab ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}>{tab}</button>
                ))}
              </div>
              {activeMarketTab === 'markets' && (
                <div className="space-y-3">
                  <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                    {(['all','main','goals','corners','half','players'] as const).map(f => (
                      <button key={f} onClick={() => setActiveMarketFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${activeMarketFilter === f ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                    ))}
                  </div>
                  {(activeMarketFilter === 'all' || activeMarketFilter === 'main') && <div className="grid grid-cols-3 gap-2"><OddsButton selection={match.markets.main.home} /><OddsButton selection={match.markets.main.draw} /><OddsButton selection={match.markets.main.away} /></div>}
                  {(activeMarketFilter === 'all' || activeMarketFilter === 'goals') && match.markets.extra && (<div className="bg-gray-950 rounded-lg p-3 border border-gray-800"><p className="text-xs font-bold text-gray-400 mb-2 uppercase">Goals & BTTS</p><div className="grid grid-cols-3 gap-2"><OddsButton selection={match.markets.extra.over} /><OddsButton selection={match.markets.extra.under} /><OddsButton selection={match.markets.extra.btts} /></div></div>)}
                  {(activeMarketFilter === 'all' || activeMarketFilter === 'main') && match.markets.special && (<div className="bg-gray-950 rounded-lg p-3 border border-gray-800"><p className="text-xs font-bold text-gray-400 mb-2 uppercase">Double Chance</p><div className="grid grid-cols-2 gap-2"><OddsButton selection={match.markets.special.dc1x} /><OddsButton selection={match.markets.special.dcx2} /></div></div>)}
                </div>
              )}
              {activeMarketTab === 'stats' && <div className="bg-gray-950 rounded-lg p-3 border border-gray-800"><p className="text-sm text-gray-300 mb-3">📊 {match.stats}</p><div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '55%' }}></div></div></div>}
              {activeMarketTab === 'codes' && <div className="bg-gray-950 rounded-lg p-3 border border-gray-800 text-center"><p className="text-sm text-gray-400 mb-2">Share this match</p><button onClick={() => { addSelection(match.markets.main.home); setNotification("Added to betslip!"); setTimeout(() => setNotification(null), 2000); }} className="px-4 py-2 bg-gray-800 hover:bg-green-600 text-white rounded text-xs font-bold">Add to Betslip</button></div>}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24 lg:pb-0">
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 25s linear infinite; }`}</style>
      
      {notification && <div className="fixed top-20 right-4 z-[110] bg-green-500 text-gray-950 px-6 py-3 rounded-lg shadow-xl font-bold animate-bounce">{notification}</div>}

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">BET<span className="text-white">NOVA</span></h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-2 rounded-lg"><span className="text-xs text-gray-400">Balance:</span><span className="text-sm font-bold text-green-500">{formatMoney(walletBalance)}</span></div>
            <button onClick={() => setIsDepositOpen(true)} className="hidden md:flex h-9 px-3 bg-green-600 text-white rounded-md font-bold text-xs">+ Deposit</button>
            {isLoggedIn ? (
              <button className="hidden sm:flex h-10 px-4 py-2 bg-gray-800 text-white rounded-md font-bold text-sm items-center gap-2"><User className="h-4 w-4" /> Hi, Harriette!<span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${vipTier.bg} ${vipTier.color}`}>{vipTier.icon} {vipTier.name}</span></button>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="hidden sm:flex h-10 px-4 py-2 bg-green-500 text-gray-950 rounded-md font-bold text-sm">Login</button>
            )}
          </div>
        </div>
      </header>

      <div className="bg-green-900/20 border-b border-green-500/20 overflow-hidden py-2"><div className="flex whitespace-nowrap animate-marquee">{[...recentWinners, ...recentWinners].map((w, i) => (<span key={i} className="mx-8 text-sm font-medium text-green-400 flex items-center gap-2"><Trophy className="w-4 h-4" /> {w}</span>))}</div></div>
      
      <div className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-2 min-w-max">
          {['Sports','Games','Live Betting','Jackpot','Livescore','Promotions','Sporty Loyalty','App','GMT+00:00'].map(item => (
            <button key={item} onClick={() => setActiveTopNav(item)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold min-h-[44px] whitespace-nowrap ${activeTopNav === item ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{item}</button>
          ))}
        </div>
      </div>

      <div className="sticky top-[72px] z-30 bg-gray-900 border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-3 min-w-max">
          {['Home','Football','vFootball','Basketball','Tennis','eFootball','Ice Hockey','Handball','More'].map(sport => (
            <button key={sport} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[60px] min-h-[44px] text-gray-500 hover:text-gray-300`}>
              <Target className="w-5 h-5" />
              <span className="text-[10px] font-medium whitespace-nowrap">{sport}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-9 space-y-6">{renderMiddleContent()}</section>
        
        {/* RIGHT SIDEBAR: BETSLIP */}
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
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${useFreeBet ? 'left-5' : 'left-0.5'}`} />
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
                <button disabled={isCoolOffActive} className={`w-full h-12 px-8 rounded-md font-bold text-base ${isCoolOffActive ? 'bg-gray-700 text-gray-400' : 'bg-green-500 text-gray-950 hover:bg-green-600'}`} onClick={initiatePlaceBet}>
                  <Lock className="w-4 h-4 inline mr-2" /> {isCoolOffActive ? 'Cool-Off Active' : 'Place Bet'}
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>

     

      {/* PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <Lock className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Enter PIN</h2>
            <input type="password" maxLength={4} value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} className="flex h-14 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-2xl text-white text-center tracking-[1em] mb-4" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => setIsPinModalOpen(false)} className="flex-1 h-11 bg-gray-800 text-gray-300 rounded-md font-bold">Cancel</button>
              <button onClick={confirmPlaceBet} className="flex-1 h-11 bg-green-500 text-gray-950 rounded-md font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => { setIsAuthOpen(false); setShowOtpStep(false); }} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            
            {showOtpStep ? (
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-sm text-gray-400 mb-6">Enter the 6-digit code sent to {authPhone}</p>
                <input type="text" maxLength={6} className="flex h-14 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-2xl text-white text-center tracking-[0.5em] mb-6 focus:ring-2 focus:ring-green-500 focus:outline-none" autoFocus />
                <button onClick={handleAuthSubmit} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold hover:bg-green-600">Verify & Login</button>
                <button onClick={() => setShowOtpStep(false)} className="w-full mt-3 text-sm text-gray-400 hover:text-white">Change Number</button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="flex border-b border-gray-800 mb-2">
                  <button type="button" onClick={() => setAuthTab('login')} className={`flex-1 pb-3 text-sm font-bold ${authTab === 'login' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}>Log In</button>
                  <button type="button" onClick={() => setAuthTab('register')} className={`flex-1 pb-3 text-sm font-bold ${authTab === 'register' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}>Register</button>
                </div>

                {authTab === 'register' && (
                  <>
                    <input type="text" placeholder="Full Name" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-sm text-white focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                    <input type="text" value={authGhanaCard} onChange={(e) => setAuthGhanaCard(e.target.value.toUpperCase())} placeholder="Ghana Card (NIA)" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-sm text-white uppercase focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                  </>
                )}

                <input type="tel" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="Phone Number (e.g. 024...)" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-sm text-white focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-sm text-white focus:ring-2 focus:ring-green-500 focus:outline-none" required />
                
                {authTab === 'login' && <div className="text-right"><button type="button" onClick={() => setAuthTab('forgot')} className="text-xs text-green-500 hover:underline">Forgot Password?</button></div>}
                
                <button type="submit" className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold hover:bg-green-600 transition-colors">
                  {authTab === 'register' ? 'Create Account' : 'Log In'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setIsDepositOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-white mb-2">Deposit Funds</h2>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
              <Gift className="w-6 h-6 text-green-500" />
              <div><p className="text-sm font-bold text-green-400">🎁 50% First Deposit Bonus!</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[10,50,100,200,500,1000].map(a => (
                <button key={a} onClick={() => setDepositAmount(a)} className={`py-2 rounded-md font-bold border ${depositAmount === a ? 'bg-green-500 border-green-500 text-gray-950' : 'bg-gray-950 border-gray-800 text-white hover:border-green-500'}`}>GHS {a}</button>
              ))}
            </div>
            <button onClick={handleDeposit} disabled={depositAmount <= 0} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold hover:bg-green-600 disabled:opacity-50">Confirm Deposit</button>
          </div>
        </div>
      )}

      {/* CHAT WIDGET */}
      <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-green-500 text-gray-950 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110">
          {isChatOpen ? <X className="w-6 h-6"/> : <MessageCircle className="w-6 h-6"/>}
        </button>
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 h-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-green-600 p-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">BetNova Support</h3>
              <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5 text-white"/></button>
            </div>
            <div className="flex-1 p-4 bg-gray-950 overflow-y-auto">
              <div className="bg-gray-800 text-white text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">👋 Hi Harriette! How can we help?</div>
            </div>
            <div className="p-3 border-t border-gray-800 bg-gray-900 flex gap-2">
              <input type="text" placeholder="Message..." className="flex-1 h-9 rounded-md bg-gray-950 border border-gray-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500"/>
              <button className="h-9 px-3 bg-green-500 text-gray-950 rounded-md font-bold text-xs hover:bg-green-600">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
