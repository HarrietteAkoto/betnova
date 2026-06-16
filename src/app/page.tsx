"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OddsButton } from "../features/OddsButton";
import { useBetslipStore } from "../store/useBetslipStore";
import { TrendingUp, Menu, User, X, MessageCircle, Share2, BarChart3, Gift, ChevronDown, ChevronUp, Zap, Search, Trophy, Bell, Play, ShieldAlert, Crown, Users, Copy, Tag, Sun, Moon, Star, Globe } from "lucide-react";

interface MatchOdds { id: string; matchId: string; matchName: string; market: string; outcome: string; odds: number; }
interface MatchMarkets { main: { home: MatchOdds; draw: MatchOdds; away: MatchOdds }; extra?: { over: MatchOdds; under: MatchOdds; btts: MatchOdds }; }
interface MatchData { id: string; home: string; away: string; score: string; status: string; isLive: boolean; sport: string; stats: string; form: string[]; markets: MatchMarkets; }

const initialMatches: MatchData[] = [
  { id: '1', home: 'Real Madrid', away: 'Manchester City', score: '2 - 1', status: "Champions League • 67'", isLive: true, sport: 'soccer', form: ['W','W','W','D','W'], stats: "Real Madrid has won 4 of their last 5 matches.", markets: { main: { home: { id: '1-1', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45 }, draw: { id: '1-x', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.10 }, away: { id: '1-2', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Man City (2)', odds: 2.80 } }, extra: { over: { id: '1-o', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.85 }, under: { id: '1-u', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: '1-b', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.70 } } } },
  { id: '2', home: 'Arsenal', away: 'Liverpool', score: 'VS', status: "Premier League • Today 20:00", isLive: false, sport: 'soccer', form: ['W','D','W','L','W'], stats: "Head-to-Head: Arsenal 2 - 3 Liverpool (Last 5)", markets: { main: { home: { id: '2-1', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Arsenal (1)', odds: 2.10 }, draw: { id: '2-x', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.40 }, away: { id: '2-2', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Liverpool (2)', odds: 3.25 } }, extra: { over: { id: '2-o', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.90 }, under: { id: '2-u', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.90 }, btts: { id: '2-b', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.65 } } } },
  { id: '3', home: 'LA Lakers', away: 'Boston Celtics', score: '88 - 92', status: "NBA • 3rd Qtr", isLive: true, sport: 'basketball', form: ['L','W','W','W','L'], stats: "Celtics are on a 12-0 run in the 3rd quarter.", markets: { main: { home: { id: '3-1', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Lakers (1)', odds: 1.90 }, draw: { id: '3-x', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Draw (X)', odds: 15.00 }, away: { id: '3-2', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Celtics (2)', odds: 1.95 } } } }
];

const recentWinners = ["🔥 Kwame just won GHS 4,500 on Real Madrid!", "🎉 Ama cashed out GHS 1,200 on Lakers!", "⚽ Yaw hit a 5-fold Acca for GHS 12,000!"];
const expertPicks = [{ id: 'ep-1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45, confidence: '92%' }];
const liveCommentary = ["67' ⚽ GOAL! Real Madrid takes the lead!", "65' 🟨 Yellow card for Rodri.", "62' 🔄 Substitution: Grealish ON."];

export default function Home() {
  const { selections, stake, mode, setStake, toggleMode, removeSelection, clearBetslip, placeBet, claimDailyBonus, hasClaimedBonus, quickBetEnabled, toggleQuickBet, quickBetStake, setQuickBetStake, totalWagered, addSelection, achievements, isCoolOffActive, applyPromoCode, activateCoolOff, deactivateCoolOff, currency, setCurrency, favorites, toggleFavorite } = useBetslipStore();
  
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [openStatsId, setOpenStatsId] = useState<string | null>(null);
  const [openMarketsId, setOpenMarketsId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'soccer' | 'basketball'>('all');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCoolOffModalOpen, setIsCoolOffModalOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [isWatchLiveOpen, setIsWatchLiveOpen] = useState<string | null>(null);
  const [commentaryIndex, setCommentaryIndex] = useState(0);
  
  // NEW: Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [walletBalance, setWalletBalance] = useState<number>(() => { if (typeof window !== 'undefined') { const saved = localStorage.getItem('betnova_wallet'); return saved ? parseFloat(saved) : 1500; } return 1500; });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => { if (typeof window !== 'undefined') { return localStorage.getItem('betnova_logged_in') === 'true'; } return false; });
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [lastGoal, setLastGoal] = useState<string | null>(null);

  const exchangeRates = { GHS: 1, USD: 0.08, EUR: 0.07 };
  const formatMoney = (amount: number) => `${currency} ${(amount * exchangeRates[currency]).toFixed(2)}`;
  const formatOdds = (odds: number) => odds; // Odds stay the same globally

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = stake * totalOdds;

  const getVipTier = () => {
    if (totalWagered >= 2000) return { name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: <Crown className="w-3 h-3 text-yellow-400" /> };
    if (totalWagered >= 500) return { name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-300/20', icon: <Crown className="w-3 h-3 text-gray-300" /> };
    return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: <Crown className="w-3 h-3 text-orange-400" /> };
  };
  const vipTier = getVipTier();

  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_wallet', walletBalance.toString()); }, [walletBalance]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_logged_in', isLoggedIn.toString()); }, [isLoggedIn]);

  useEffect(() => {
    const interval = setInterval(() => setCommentaryIndex(prev => (prev + 1) % liveCommentary.length), 8000);
    return () => clearInterval(interval);
  }, []);

  // Sort matches: Favorites first, then filter
  const sortedAndFilteredMatches = matches
    .filter(match => {
      const matchesSearch = match.home.toLowerCase().includes(searchQuery.toLowerCase()) || match.away.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeFilter === 'live') return match.isLive;
      if (activeFilter === 'soccer') return match.sport === 'soccer';
      if (activeFilter === 'basketball') return match.sport === 'basketball';
      return true;
    })
    .sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1 : 0;
      const bFav = favorites.includes(b.id) ? 1 : 0;
      return bFav - aFav; // Favorites bubble to top
    });

  useEffect(() => {
    if (!hasClaimedBonus) { setTimeout(() => { setShowBonusModal(true); claimDailyBonus(); setWalletBalance(prev => prev + 25); }, 1500); }
  }, [hasClaimedBonus, claimDailyBonus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches => prevMatches.map(match => {
        if (!match.isLive) return match;
        const currentMinuteStr = match.status.match(/\d+/)?.[0] || '0';
        let newMinute = parseInt(currentMinuteStr, 10) + 1;
        if (newMinute > 90) newMinute = 90; 
        const newStatus = match.status.replace(/\d+'/, `${newMinute}'`);
        let newScore = match.score;
        let goalScorer: string | null = null;
        if (match.score !== 'VS' && Math.random() < 0.02) {
          const scores = newScore.split(' - ').map(Number);
          const scoringTeam = Math.random() > 0.5 ? 0 : 1;
          scores[scoringTeam] += 1;
          newScore = `${scores[0]} - ${scores[1]}`;
          goalScorer = scoringTeam === 0 ? match.home : match.away;
        }
        if (goalScorer) setLastGoal(`${goalScorer} scores!`);
        const fluctuate = (odd: number) => { const change = (Math.random() - 0.5) * 0.1; return Math.max(1.01, parseFloat((odd + change).toFixed(2))); };
        return { 
          ...match, score: newScore, status: newStatus,
          markets: { ...match.markets, main: { home: { ...match.markets.main.home, odds: fluctuate(match.markets.main.home.odds) }, draw: { ...match.markets.main.draw, odds: fluctuate(match.markets.main.draw.odds) }, away: { ...match.markets.main.away, odds: fluctuate(match.markets.main.away.odds) } }, extra: match.markets.extra ? { over: { ...match.markets.extra.over, odds: fluctuate(match.markets.extra.over.odds) }, under: { ...match.markets.extra.under, odds: fluctuate(match.markets.extra.under.odds) }, btts: { ...match.markets.extra.btts, odds: fluctuate(match.markets.extra.btts.odds) } } : undefined }
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (lastGoal) { setNotification(`⚽ GOAL! ${lastGoal}`); setTimeout(() => setLastGoal(null), 4000); } }, [lastGoal]);

  const handlePlaceBet = () => {
    if (isCoolOffActive) { setNotification("🔒 Account is in Cool-Off."); setTimeout(() => setNotification(null), 3000); return; }
    if (selections.length === 0) { setNotification("🚫 Please select an outcome!"); setTimeout(() => setNotification(null), 3000); return; }
    if (stake <= 0) { setNotification("🚫 Enter a valid stake!"); setTimeout(() => setNotification(null), 3000); return; }
    if (stake > walletBalance) { setNotification("🚫 Insufficient balance!"); setTimeout(() => setNotification(null), 3000); return; }
    setWalletBalance(prev => prev - stake);
    placeBet(totalOdds, potentialWin); 
    setNotification(`✅ Placed bet for ${formatMoney(stake)}!`);
    clearBetslip();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShareBetslip = () => {
    if (selections.length === 0) return;
    const text = `🔥 My BetNova Betslip:\n${selections.map(s => `${s.matchName} - ${s.outcome} @ ${s.odds}`).join('\n')}\n💰 Potential Win: ${formatMoney(potentialWin)}\n\nPlace your bets at BetNova!`;
    navigator.clipboard.writeText(text);
    setNotification("📋 Betslip copied!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeposit = () => {
    if (depositAmount > 0) {
      setWalletBalance(prev => prev + depositAmount);
      setNotification(`✅ Deposited ${formatMoney(depositAmount)}!`);
      setTimeout(() => setNotification(null), 3000);
      setDepositAmount(0); setIsDepositOpen(false);
    }
  };

  const handleCopyExpertPick = (pick: typeof expertPicks[0]) => {
    addSelection({ id: pick.id, matchId: 'ep', matchName: pick.matchName, market: pick.market, outcome: pick.outcome, odds: pick.odds });
    setNotification(`📋 Copied Expert Pick!`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className={`min-h-screen font-sans pb-20 lg:pb-0 transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 25s linear infinite; }`}</style>

      <header className="sticky top-0 z-50 w-full border-b dark:border-gray-800 border-gray-200 dark:bg-gray-900/95 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-800/10 rounded-md dark:text-gray-400 text-gray-600">{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
            <h1 className="text-2xl font-bold tracking-tight text-green-500">BET<span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>NOVA</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium dark:text-gray-400 text-gray-600">
            <Link href="/" className="hover:text-green-500 transition-colors">Sports</Link>
            <Link href="/" className="hover:text-green-500 transition-colors">Live Betting</Link>
            <Link href="/my-bets" className="hover:text-green-500 transition-colors">My Bets</div>
          </nav>
          <div className="flex items-center gap-3">
            {/* NEW: Currency Dropdown */}
            <div className="relative group">
              <button className="hidden md:flex items-center gap-1 h-9 px-3 dark:bg-gray-950 bg-gray-100 border dark:border-gray-800 border-gray-200 rounded-md font-bold text-xs hover:border-green-500 transition-colors">
                <Globe className="w-3 h-3" /> {currency}
              </button>
              <div className="absolute right-0 mt-2 w-32 dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {(['GHS', 'USD', 'EUR'] as const).map((c) => (
                  <button key={c} onClick={() => setCurrency(c)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800/10 ${currency === c ? 'text-green-500 font-bold' : 'dark:text-gray-300 text-gray-700'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 dark:bg-gray-950 bg-gray-100 border dark:border-gray-800 border-gray-200 px-3 py-2 rounded-lg">
              <span className="text-xs dark:text-gray-400 text-gray-600">Balance:</span>
              <span className="text-sm font-bold text-green-500">{formatMoney(walletBalance)}</span>
            </div>
            <button onClick={() => setIsDepositOpen(true)} className="hidden md:flex h-9 px-3 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700 transition-colors">+ Deposit</button>
            
            {/* NEW: Theme Toggle */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-gray-800/10 rounded-md dark:text-gray-400 text-gray-600">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 hover:bg-gray-800/10 rounded-md dark:text-gray-400 text-gray-600 relative"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center"><h3 className="font-bold dark:text-white text-gray-900">Notifications</h3><button onClick={() => setIsNotifOpen(false)}><X className="w-4 h-4 dark:text-gray-400 text-gray-600" /></button></div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 border-b dark:border-gray-800 border-gray-200 hover:bg-gray-800/10 cursor-pointer"><p className="text-sm font-medium dark:text-white text-gray-900">⚽ Goal! Real Madrid scores!</p><p className="text-xs dark:text-gray-500 text-gray-500 mt-1">2 mins ago</p></div>
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative group">
                <button className="hidden sm:flex h-10 px-4 py-2 dark:bg-gray-800 bg-gray-200 dark:text-white text-gray-900 rounded-md font-bold text-sm hover:bg-gray-700 transition-colors items-center gap-2">
                  <User className="h-4 w-4" /> Hi, Harriette!
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${vipTier.bg} ${vipTier.color} border border-current/20`}>{vipTier.icon} {vipTier.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 border-b dark:border-gray-800 border-gray-200">
                    <p className="text-xs dark:text-gray-400 text-gray-600">Total Wagered</p>
                    <p className="text-sm font-bold dark:text-white text-gray-900">{formatMoney(totalWagered)}</p>
                  </div>
                  <button onClick={() => setIsCoolOffModalOpen(true)} className="w-full text-left px-4 py-3 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-800/10 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Cool-Off</button>
                  <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800/10">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hidden sm:flex h-10 px-4 py-2 bg-green-500 text-gray-950 rounded-md font-bold text-sm hover:bg-green-600 transition-colors">Login</button>
            )}
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full dark:bg-gray-900 bg-white border-b dark:border-gray-800 border-gray-200 p-4 space-y-4 z-40 shadow-xl animate-in slide-in-from-top-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block font-medium py-2 border-b dark:border-gray-800 border-gray-200 dark:text-white text-gray-900">Sports</Link>
            <Link href="/my-bets" onClick={() => setIsMobileMenuOpen(false)} className="block dark:text-gray-400 text-gray-600 py-2">My Bets</Link>
            <div className="flex items-center justify-between pt-2 border-t dark:border-gray-800 border-gray-200"><span className="text-sm dark:text-gray-400 text-gray-600">Balance:</span><span className="text-sm font-bold text-green-500">{formatMoney(walletBalance)}</span></div>
          </div>
        )}
      </header>

      <div className="dark:bg-green-900/20 bg-green-50 border-b dark:border-green-500/20 border-green-200 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-marquee">{[...recentWinners, ...recentWinners].map((winner, i) => (<span key={i} className="mx-8 text-sm font-medium text-green-500 flex items-center gap-2"><Trophy className="w-4 h-4" /> {winner}</span>))}</div>
      </div>

      {selections.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full dark:bg-gray-900 bg-white border-t dark:border-gray-800 border-gray-200 p-4 z-40 flex items-center justify-between shadow-2xl">
          <div><p className="text-xs dark:text-gray-400 text-gray-600">{selections.length} Selection(s)</p><p className="text-green-500 font-bold">{formatMoney(potentialWin)}</p></div>
          <button onClick={() => { document.getElementById('mobile-betslip')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="bg-green-500 text-gray-950 px-6 py-2 rounded-md font-bold text-sm hover:bg-green-600 transition-colors">View Betslip</button>
        </div>
      )}

      {notification && (<div className="fixed top-20 right-4 z-[110] bg-green-500 text-gray-950 px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 animate-bounce">{notification}</div>)}

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="dark:bg-gray-900 bg-white rounded-lg border dark:border-gray-800 border-gray-200 p-4">
            <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Popular Sports</h3>
            <ul className="space-y-2 text-sm dark:text-gray-400 text-gray-600">
              <li className="flex items-center justify-between p-2 rounded-md dark:bg-gray-950 bg-gray-100 border dark:border-gray-800 border-gray-200 dark:text-white text-gray-900 cursor-pointer hover:border-green-500 transition-colors"><span>⚽ Soccer</span><span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse font-bold">142</span></li>
              <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/10 cursor-pointer transition-colors"><span>🏀 Basketball</span><span className="text-xs">45</span></li>
            </ul>
          </div>

          <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 bg-gray-100 rounded-lg border border-green-500/30 p-4">
            <h3 className="font-semibold dark:text-white text-gray-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-green-500" /> Expert Picks</h3>
            <div className="space-y-3">
              {expertPicks.map((pick) => (
                <div key={pick.id} className="dark:bg-gray-950/50 bg-white p-3 rounded border dark:border-gray-800 border-gray-200">
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{pick.confidence} Confidence</span>
                  <p className="text-xs dark:text-gray-400 text-gray-600 my-1">{pick.matchName}</p>
                  <div className="flex items-center justify-between"><span className="text-sm font-medium dark:text-white text-gray-900">{pick.outcome}</span><span className="text-sm font-bold text-green-500">{pick.odds.toFixed(2)}</span></div>
                  <button onClick={() => handleCopyExpertPick(pick)} className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 dark:bg-gray-800 bg-gray-200 hover:bg-green-600 dark:text-gray-300 text-gray-700 hover:text-white text-xs font-bold rounded transition-colors"><Copy className="w-3 h-3" /> Copy to Betslip</button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-6 space-y-6">
          <div className="dark:bg-gradient-to-r dark:from-green-900/40 dark:to-gray-900 bg-gradient-to-r from-green-100 to-white border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="p-2 bg-green-500/20 rounded-lg"><Zap className="w-6 h-6 text-green-500" /></div><div><h3 className="font-bold dark:text-white text-gray-900 text-sm">⚡ 10% Acca Boost!</h3><p className="text-xs dark:text-gray-400 text-gray-600">Get 10% extra on your winnings for 5+ selections.</p></div></div>
            <button className="px-4 py-2 bg-green-500 text-gray-950 text-xs font-bold rounded-md hover:bg-green-600 transition-colors">Claim Now</button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[{ id: 'all', label: '🔥 All' }, { id: 'live', label: '🔴 Live' }, { id: 'soccer', label: '⚽ Soccer' }, { id: 'basketball', label: '🏀 Basketball' }].map((filter) => (
              <button key={filter.id} onClick={() => setActiveFilter(filter.id as any)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === filter.id ? 'bg-green-500 text-gray-950 shadow-lg shadow-green-500/20' : 'dark:bg-gray-900 bg-white dark:text-gray-400 text-gray-600 hover:bg-gray-800/10 border dark:border-gray-800 border-gray-200'}`}>{filter.label}</button>
            ))}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-gray-500 text-gray-400" />
            <input type="text" placeholder="Search teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-lg py-3 pl-10 pr-4 dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
          </div>

          {sortedAndFilteredMatches.length === 0 ? (<div className="text-center py-12 dark:text-gray-500 text-gray-400">No matches found</div>) : (
            sortedAndFilteredMatches.map((match) => (
              <div key={match.id} className="dark:bg-gray-900 bg-white rounded-lg border dark:border-gray-800 border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between text-xs dark:text-gray-500 text-gray-500">
                  <span>{match.status}</span>
                  <div className="flex gap-2">
                    {match.isLive && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
                    {match.isLive && <button onClick={() => setIsWatchLiveOpen(match.id)} className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-blue-700"><Play className="w-3 h-3 fill-white" /> Watch</button>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold dark:text-white text-gray-900">{match.home}</p>
                      {/* NEW: Favorite Star */}
                      <button onClick={() => toggleFavorite(match.id)} className="hover:scale-110 transition-transform">
                        <Star className={`w-4 h-4 ${favorites.includes(match.id) ? 'fill-yellow-400 text-yellow-400' : 'dark:text-gray-600 text-gray-400'}`} />
                      </button>
                      <div className="flex gap-1">{match.form.map((result, i) => (<span key={i} className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded ${result === 'W' ? 'bg-green-500/20 text-green-500' : result === 'D' ? 'dark:bg-gray-500/20 bg-gray-200 dark:text-gray-400 text-gray-600' : 'bg-red-500/20 text-red-500'}`}>{result}</span>))}</div>
                    </div>
                    <p className="font-semibold dark:text-white text-gray-900 mt-1">{match.away}</p>
                  </div>
                  <div className={`text-2xl font-bold px-4 transition-colors duration-500 ${match.isLive ? 'text-green-500' : 'dark:text-gray-500 text-gray-400'}`}>{match.score}</div>
                </div>
                
                {match.isLive && (
                  <div className="dark:bg-gray-950 bg-gray-100 border dark:border-gray-800 border-gray-200 rounded p-2 flex items-center gap-2 text-xs">
                    <span className="text-green-500 font-bold animate-pulse">● LIVE</span>
                    <span className="dark:text-gray-400 text-gray-600 truncate">{liveCommentary[commentaryIndex]}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2 border-t dark:border-gray-800 border-gray-200">
                  <OddsButton selection={match.markets.main.home} />
                  <OddsButton selection={match.markets.main.draw} />
                  <OddsButton selection={match.markets.main.away} />
                </div>
                {match.sport === 'soccer' && match.markets.extra && (
                  <div>
                    <button onClick={() => setOpenMarketsId(openMarketsId === match.id ? null : match.id)} className="flex items-center gap-2 text-xs dark:text-gray-400 text-gray-600 hover:text-green-500 transition-colors font-medium mt-2">
                      {openMarketsId === match.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} More Markets
                    </button>
                    {openMarketsId === match.id && (
                      <div className="grid grid-cols-3 gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
                        <OddsButton selection={match.markets.extra.over} />
                        <OddsButton selection={match.markets.extra.under} />
                        <OddsButton selection={match.markets.extra.btts} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        <aside id="mobile-betslip" className="lg:col-span-3">
          <div className="dark:bg-gray-900 bg-white rounded-lg border dark:border-gray-800 border-gray-200 p-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white text-gray-900 flex items-center gap-2">Betslip {selections.length > 0 && <span className="bg-green-500 text-gray-950 text-xs px-2 py-0.5 rounded-full font-bold">{selections.length}</span>}</h3>
              {selections.length > 0 && (<button onClick={handleShareBetslip} className="dark:text-gray-400 text-gray-600 hover:text-green-500 transition-colors"><Share2 className="w-4 h-4" /></button>)}
            </div>
            <div className="mb-4 p-3 dark:bg-gray-950 bg-gray-100 rounded-lg border dark:border-gray-800 border-gray-200">
              <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold dark:text-white text-gray-900 flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Quick Bet</span><button onClick={toggleQuickBet} className={`w-10 h-5 rounded-full relative transition-colors ${quickBetEnabled ? 'bg-green-500' : 'dark:bg-gray-700 bg-gray-300'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${quickBetEnabled ? 'left-5' : 'left-0.5'}`} /></button></div>
              {quickBetEnabled && (<div className="flex items-center gap-2"><span className="text-xs dark:text-gray-400 text-gray-600">Stake:</span><input type="number" value={quickBetStake} onChange={(e) => setQuickBetStake(parseFloat(e.target.value) || 0)} className="w-20 h-7 rounded dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 text-xs dark:text-white text-gray-900 text-center focus:outline-none focus:ring-1 focus:ring-green-500" /><span className="text-xs dark:text-gray-500 text-gray-500">{currency}</span></div>)}
            </div>
            <div className="space-y-3 mb-4 min-h-[100px]">
              {selections.length === 0 ? (<p className="text-center dark:text-gray-500 text-gray-400 text-sm py-8">Click an odd to add to your betslip</p>) : (
                selections.map((sel) => (
                  <div key={sel.id} className="dark:bg-gray-950 bg-gray-100 p-3 rounded border dark:border-gray-800 border-gray-200 relative group">
                    <button onClick={() => removeSelection(sel.id)} className="absolute top-2 right-2 dark:text-gray-500 text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                    <span className="text-xs dark:text-gray-500 text-gray-500">{sel.market}</span><p className="text-sm font-medium dark:text-white text-gray-900 mb-1">{sel.matchName}</p><p className="text-xs dark:text-gray-400 text-gray-600 mb-2">{sel.outcome}</p><span className="text-green-500 font-bold">{sel.odds.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            {selections.length > 0 && (
              <div className="space-y-3 border-t dark:border-gray-800 border-gray-200 pt-4">
                <div className="flex gap-2">{[10, 50, 100].map((amt) => (<button key={amt} onClick={() => setStake(amt)} className="flex-1 py-1 text-xs font-bold dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 rounded hover:bg-green-600 hover:text-white transition-colors">{formatMoney(amt)}</button>))}<button onClick={() => setStake(walletBalance)} className="flex-1 py-1 text-xs font-bold dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 rounded hover:bg-green-600 hover:text-white transition-colors">MAX</button></div>
                <div><label className="text-xs dark:text-gray-400 text-gray-600 mb-1 block">Stake ({currency})</label><input type="number" placeholder="0.00" className="flex h-10 w-full rounded-md border dark:border-gray-800 border-gray-200 dark:bg-gray-950 bg-white px-3 py-2 text-sm dark:text-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-right font-bold" value={stake === 0 ? '' : stake} onChange={(e) => setStake(parseFloat(e.target.value) || 0)} /></div>
                <div className="flex justify-between text-sm"><span className="dark:text-gray-400 text-gray-600">Total Odds:</span><span className="dark:text-white text-gray-900 font-bold">{totalOdds.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="dark:text-gray-400 text-gray-600">Potential Win:</span><span className="text-green-500 font-bold">{formatMoney(potentialWin)}</span></div>
                <button disabled={isCoolOffActive} className={`w-full h-12 px-8 rounded-md font-bold text-base transition-colors ${isCoolOffActive ? 'dark:bg-gray-700 bg-gray-300 dark:text-gray-400 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-gray-950 hover:bg-green-600'}`} onClick={handlePlaceBet}>{isCoolOffActive ? '🔒 Cool-Off Active' : 'Place Bet'}</button>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="border-t dark:border-gray-800 border-gray-200 dark:bg-gray-900 bg-gray-100 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm dark:text-gray-500 text-gray-600"><p className="mb-2">18+ Play Responsibly. Licensed by the Gaming Commission.</p><p>© 2026 BetNova. All rights reserved.</p></div>
      </footer>

      {/* Cool-Off Modal */}
      {isCoolOffModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCoolOffModalOpen(false)} /><div className="relative dark:bg-gray-900 bg-white border-2 border-red-500/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"><ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Self-Exclusion / Cool-Off</h2><p className="text-sm dark:text-gray-400 text-gray-600 mb-6">Temporarily lock your account to play responsibly.</p><div className="grid grid-cols-3 gap-2 mb-4">{[{h:24, l:'24h'}, {h:168, l:'7 Days'}, {h:720, l:'30 Days'}].map((c) => (<button key={c.h} onClick={() => { activateCoolOff(c.h); setIsCoolOffModalOpen(false); }} className="py-2 rounded-md font-bold dark:bg-gray-800 bg-gray-100 dark:text-white text-gray-900 hover:bg-red-500 hover:text-white transition-colors">{c.l}</button>))}</div><button onClick={deactivateCoolOff} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors mb-2">Unlock Early</button><button onClick={() => setIsCoolOffModalOpen(false)} className="w-full h-11 dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 rounded-md font-bold text-base hover:bg-gray-700 transition-colors">Cancel</button></div></div>
      )}

      {/* Deposit Modal + Promo */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDepositOpen(false)} /><div className="relative dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-6 w-full max-w-md shadow-2xl"><button onClick={() => setIsDepositOpen(false)} className="absolute top-4 right-4 dark:text-gray-500 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button><h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Deposit Funds</h2><div className="mb-4"><label className="block text-xs font-medium dark:text-gray-400 text-gray-600 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Promo Code</label><div className="flex gap-2"><input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. WELCOME25" className="flex h-10 w-full rounded-md border dark:border-gray-800 border-gray-200 dark:bg-gray-950 bg-gray-100 px-3 py-2 text-sm dark:text-white text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-green-500" /><button onClick={() => applyPromoCode(promoInput)} className="h-10 px-4 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700">Apply</button></div></div><div className="grid grid-cols-3 gap-2 mb-4">{[10, 50, 100, 200, 500, 1000].map((amt) => (<button key={amt} onClick={() => setDepositAmount(amt)} className={`py-2 rounded-md font-bold border transition-colors ${depositAmount === amt ? 'bg-green-500 border-green-500 text-gray-950' : 'dark:bg-gray-950 bg-gray-100 border dark:border-gray-800 border-gray-200 dark:text-white text-gray-900 hover:border-green-500'}`}>{formatMoney(amt)}</button>))}</div><div className="mb-6"><label className="block text-xs font-medium dark:text-gray-400 text-gray-600 mb-1">Custom Amount</label><input type="number" value={depositAmount || ''} onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)} className="flex h-10 w-full rounded-md border dark:border-gray-800 border-gray-200 dark:bg-gray-950 bg-gray-100 px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" /></div><button onClick={handleDeposit} disabled={depositAmount <= 0} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Deposit</button></div></div>
      )}

      {isLoginOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)} /><div className="relative dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl p-6 w-full max-w-md shadow-2xl"><button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 dark:text-gray-500 text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button><div className="text-center mb-6"><h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Welcome Back</h2><p className="text-sm dark:text-gray-400 text-gray-600">Log in to your BetNova account.</p></div><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setIsLoginOpen(false); }}><div><label className="block text-xs font-medium dark:text-gray-400 text-gray-600 mb-1">Email or Phone</label><input type="text" placeholder="user@example.com" className="flex h-10 w-full rounded-md border dark:border-gray-800 border-gray-200 dark:bg-gray-950 bg-gray-100 px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-xs font-medium dark:text-gray-400 text-gray-600 mb-1">Password</label><input type="password" placeholder="••••••••" className="flex h-10 w-full rounded-md border dark:border-gray-800 border-gray-200 dark:bg-gray-950 bg-gray-100 px-3 py-2 text-sm dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" /></div><button type="submit" className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors mt-2">Log In</button></form></div></div>)}
      
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (<div className="mb-4 w-80 h-96 dark:bg-gray-900 bg-white border dark:border-gray-800 border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden"><div className="bg-green-600 p-4 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div><h3 className="font-bold text-white text-sm">BetNova Support</h3></div><button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button></div><div className="flex-1 p-4 overflow-y-auto space-y-3 dark:bg-gray-950 bg-gray-50"><div className="dark:bg-gray-800 bg-gray-200 dark:text-white text-gray-900 text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">👋 Hi Harriette! Welcome to BetNova. How can we help you today?</div></div><div className="p-3 border-t dark:border-gray-800 border-gray-200 dark:bg-gray-900 bg-gray-100"><div className="flex gap-2"><input type="text" placeholder="Type a message..." className="flex-1 h-9 rounded-md dark:bg-gray-950 bg-white border dark:border-gray-800 border-gray-200 px-3 text-sm dark:text-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500" /><button className="h-9 px-3 bg-green-500 text-gray-950 rounded-md font-bold text-xs hover:bg-green-600">Send</button></div></div></div>)}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-green-500 text-gray-950 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110">{isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}</button>
      </div>
    </div>
  );
}
