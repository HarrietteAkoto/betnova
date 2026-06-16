"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OddsButton } from "../features/OddsButton";
import { useBetslipStore } from "../store/useBetslipStore";
import { TrendingUp, Menu, User, X, MessageCircle, Share2, BarChart3, Gift, ChevronDown, ChevronUp, Zap, Search, Trophy, Bell, Play, ShieldAlert } from "lucide-react";

interface MatchOdds { id: string; matchId: string; matchName: string; market: string; outcome: string; odds: number; }
interface MatchMarkets { main: { home: MatchOdds; draw: MatchOdds; away: MatchOdds }; extra?: { over: MatchOdds; under: MatchOdds; btts: MatchOdds }; }
interface MatchData { id: string; home: string; away: string; score: string; status: string; isLive: boolean; sport: string; stats: string; form: string[]; markets: MatchMarkets; }

const initialMatches: MatchData[] = [
  { id: '1', home: 'Real Madrid', away: 'Manchester City', score: '2 - 1', status: "Champions League • 67'", isLive: true, sport: 'soccer', form: ['W', 'W', 'W', 'D', 'W'], stats: "Real Madrid has won 4 of their last 5 matches.", markets: { main: { home: { id: '1-1', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45 }, draw: { id: '1-x', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.10 }, away: { id: '1-2', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Man City (2)', odds: 2.80 } }, extra: { over: { id: '1-o', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.85 }, under: { id: '1-u', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: '1-b', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.70 } } } },
  { id: '2', home: 'Arsenal', away: 'Liverpool', score: 'VS', status: "Premier League • Today 20:00", isLive: false, sport: 'soccer', form: ['W', 'D', 'W', 'L', 'W'], stats: "Head-to-Head: Arsenal 2 - 3 Liverpool (Last 5)", markets: { main: { home: { id: '2-1', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Arsenal (1)', odds: 2.10 }, draw: { id: '2-x', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.40 }, away: { id: '2-2', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Liverpool (2)', odds: 3.25 } }, extra: { over: { id: '2-o', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.90 }, under: { id: '2-u', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.90 }, btts: { id: '2-b', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.65 } } } },
  { id: '3', home: 'LA Lakers', away: 'Boston Celtics', score: '88 - 92', status: "NBA • 3rd Qtr", isLive: true, sport: 'basketball', form: ['L', 'W', 'W', 'W', 'L'], stats: "Celtics are on a 12-0 run in the 3rd quarter.", markets: { main: { home: { id: '3-1', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Lakers (1)', odds: 1.90 }, draw: { id: '3-x', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Draw (X)', odds: 15.00 }, away: { id: '3-2', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Celtics (2)', odds: 1.95 } } } }
];

const recentWinners = ["🔥 Kwame just won GHS 4,500 on Real Madrid!", "🎉 Ama cashed out GHS 1,200 on Lakers!", "⚽ Yaw hit a 5-fold Acca for GHS 12,000!", "💰 Esi just deposited GHS 500 and won big!"];

export default function Home() {
  const { selections, stake, mode, setStake, toggleMode, removeSelection, clearBetslip, placeBet, claimDailyBonus, hasClaimedBonus } = useBetslipStore();
  
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
  
  // NEW: Notification & Responsible Gaming States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('betnova_limit');
      return saved ? parseFloat(saved) : 1000;
    }
    return 1000;
  });
  const [newLimit, setNewLimit] = useState(dailyLimit);
  const [isWatchLiveOpen, setIsWatchLiveOpen] = useState<string | null>(null);

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('betnova_wallet');
      return saved ? parseFloat(saved) : 1500;
    }
    return 1500;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('betnova_logged_in') === 'true';
    }
    return false;
  });

  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [lastGoal, setLastGoal] = useState<string | null>(null);

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = stake * totalOdds;

  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_wallet', walletBalance.toString()); }, [walletBalance]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_logged_in', isLoggedIn.toString()); }, [isLoggedIn]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('betnova_limit', dailyLimit.toString()); }, [dailyLimit]);

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.home.toLowerCase().includes(searchQuery.toLowerCase()) || match.away.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'live') return match.isLive;
    if (activeFilter === 'soccer') return match.sport === 'soccer';
    if (activeFilter === 'basketball') return match.sport === 'basketball';
    return true;
  });

  useEffect(() => {
    if (!hasClaimedBonus) {
      setTimeout(() => { setShowBonusModal(true); claimDailyBonus(); setWalletBalance(prev => prev + 25); }, 1500);
    }
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
        const fluctuate = (odd: number) => {
          const change = (Math.random() - 0.5) * 0.1;
          return Math.max(1.01, parseFloat((odd + change).toFixed(2)));
        };
        return { 
          ...match, score: newScore, status: newStatus,
          markets: {
            ...match.markets,
            main: {
              home: { ...match.markets.main.home, odds: fluctuate(match.markets.main.home.odds) },
              draw: { ...match.markets.main.draw, odds: fluctuate(match.markets.main.draw.odds) },
              away: { ...match.markets.main.away, odds: fluctuate(match.markets.main.away.odds) },
            },
            extra: match.markets.extra ? {
              over: { ...match.markets.extra.over, odds: fluctuate(match.markets.extra.over.odds) },
              under: { ...match.markets.extra.under, odds: fluctuate(match.markets.extra.under.odds) },
              btts: { ...match.markets.extra.btts, odds: fluctuate(match.markets.extra.btts.odds) },
            } : undefined
          }
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastGoal) {
      setNotification(`⚽ GOAL! ${lastGoal}`);
      setTimeout(() => setLastGoal(null), 4000);
    }
  }, [lastGoal]);

  const handlePlaceBet = () => {
    if (selections.length === 0 || stake <= 0) return;
    placeBet(totalOdds, potentialWin); 
    setNotification(`✅ Successfully placed ${mode} bet for GHS ${stake.toFixed(2)}!`);
    clearBetslip();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShareBetslip = () => {
    if (selections.length === 0) return;
    const text = `🔥 My BetNova Betslip:\n${selections.map(s => `${s.matchName} - ${s.outcome} @ ${s.odds}`).join('\n')}\n💰 Potential Win: GHS ${potentialWin.toFixed(2)}\n\nPlace your bets at BetNova!`;
    navigator.clipboard.writeText(text);
    setNotification("📋 Betslip copied to clipboard!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeposit = () => {
    if (depositAmount > dailyLimit) {
      setNotification(`🚫 Exceeds daily limit of GHS ${dailyLimit}!`);
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (depositAmount > 0) {
      setWalletBalance(prev => prev + depositAmount);
      setNotification(`✅ Successfully deposited GHS ${depositAmount}!`);
      setTimeout(() => setNotification(null), 3000);
      setDepositAmount(0);
      setIsDepositOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-20 lg:pb-0">
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 25s linear infinite; }`}</style>

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-800 rounded-md text-gray-400">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-green-500">BET<span className="text-white">NOVA</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link href="/" className="text-white hover:text-green-500 transition-colors">Sports</Link>
            <Link href="/" className="hover:text-green-500 transition-colors">Live Betting</Link>
            <Link href="/my-bets" className="hover:text-green-500 transition-colors">My Bets</Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-2 rounded-lg">
              <span className="text-xs text-gray-400">Balance:</span>
              <span className="text-sm font-bold text-green-500">GHS {walletBalance.toFixed(2)}</span>
            </div>
            <button onClick={() => setIsDepositOpen(true)} className="hidden md:flex h-9 px-3 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700 transition-colors">+ Deposit</button>
            
            {/* NEW: Notification Bell */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 hover:bg-gray-800 rounded-md text-gray-400 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">Notifications</h3>
                    <button onClick={() => setIsNotifOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                      <p className="text-sm text-white font-medium">⚽ Goal! Real Madrid scores!</p>
                      <p className="text-xs text-gray-500 mt-1">2 mins ago</p>
                    </div>
                    <div className="p-3 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                      <p className="text-sm text-white font-medium">📉 Odds dropped on Arsenal (1.90)</p>
                      <p className="text-xs text-gray-500 mt-1">15 mins ago</p>
                    </div>
                    <div className="p-3 hover:bg-gray-800/50 cursor-pointer">
                      <p className="text-sm text-white font-medium">🎉 Daily Bonus Available!</p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 hover:bg-gray-800 rounded-md text-gray-400"><User className="h-5 w-5" /></button>
            {isLoggedIn ? (
              <div className="relative group">
                <button className="hidden sm:flex h-10 px-4 py-2 bg-gray-800 text-white rounded-md font-bold text-sm hover:bg-gray-700 transition-colors items-center gap-2">
                  <User className="h-4 w-4" /> Hi, Harriette!
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={() => setIsLimitModalOpen(true)} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Set Deposit Limits</button>
                  <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hidden sm:flex h-10 px-4 py-2 bg-green-500 text-gray-950 rounded-md font-bold text-sm hover:bg-green-600 transition-colors">Login</button>
            )}
         
