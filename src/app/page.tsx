"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OddsButton } from "../features/OddsButton";
import { useBetslipStore } from "../store/useBetslipStore";
import { 
  TrendingUp, Menu, User, X, MessageCircle, Share2, BarChart3, Gift, ChevronDown, ChevronUp, 
  Zap, Search, Trophy, Bell, Play, ShieldAlert, Crown, Users, Copy, Tag, Star, Globe, 
  Gamepad2, Wallet, Ticket, Lock, Smartphone, CreditCard, HelpCircle, ArrowLeft, 
  Timer, Calendar, Grid3X3, Activity, History, Flame, Award, ClipboardList, Home, 
  Monitor, Basketball, Tennis, Table2, IceHockey, Hand, MoreHorizontal, Soccer
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
  { id: 'wc-1', home: 'Ghana', away: 'Brazil', score: 'VS', status: "FIFA World Cup 2026 • Group Stage", isLive: false, sport: 'soccer', form: ['W','W','D','W','L'], stats: "Ghana looking strong in qualifiers.", markets: { main: { home: { id: 'wc-h', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Ghana (1)', odds: 4.50 }, draw: { id: 'wc-d', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.20 }, away: { id: 'wc-a', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Match Winner', outcome: 'Brazil (2)', odds: 1.65 } }, extra: { over: { id: 'wc-o', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.80 }, under: { id: 'wc-u', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: 'wc-b', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.75 } }, special: { dc1x: { id: 'wc-dc1', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Double Chance', outcome: 'Ghana or Draw (1X)', odds: 1.90 }, dcx2: { id: 'wc-dc2', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Double Chance', outcome: 'Brazil or Draw (X2)', odds: 1.25 }, cs: { id: 'wc-cs', matchId: 'wc-1', matchName: 'Ghana vs Brazil', market: 'Correct Score', outcome: '1 - 1', odds: 6.50 } } } },
  { id: '1', home: 'Real Madrid', away: 'Manchester City', score: '2 - 1', status: "Champions League • 67'", isLive: true, sport: 'soccer', form: ['W','W','W','D','W'], stats: "Real Madrid has won 4 of their last 5 matches.", markets: { main: { home: { id: '1-1', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45 }, draw: { id: '1-x', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.10 }, away: { id: '1-2', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Man City (2)', odds: 2.80 } }, extra: { over: { id: '1-o', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.85 }, under: { id: '1-u', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: '1-b', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.70 } } } },
  { id: '3', home: 'LA Lakers', away: 'Boston Celtics', score: '88 - 92', status: "NBA • 3rd Qtr", isLive: true, sport: 'basketball', form: ['L','W','W','W','L'], stats: "Celtics are on a 12-0 run in the 3rd quarter.", markets: { main: { home: { id: '3-1', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Lakers (1)', odds: 1.90 }, draw: { id: '3-x', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Draw (X)', odds: 15.00 }, away: { id: '3-2', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Celtics (2)', odds: 1.95 } } } }
];

const recentWinners = [
  "🔥 024***456 just won GHS 4,500 on Real Madrid!",
  "🎉 050***789 cashed out GHS 1,200 on Lakers!",
  "⚽ 020***123 hit a 5-fold Acca for GHS 12,000!",
  "💰 055***901 just deposited GHS 500 and won big!"
];

const expertPicks = [{ id: 'ep-1', matchName: 'Ghana vs Brazil', market: 'Double Chance', outcome: 'Ghana or Draw (1X)', odds: 1.90, confidence: '85%' }];
const liveCommentary = ["67' ⚽ GOAL! Real Madrid takes the lead!", "65' 🟨 Yellow card for Rodri.", "62' 🔄 Substitution: Grealish ON."];

const jackpotMatches = Array.from({ length: 12 }, (_, i) => ({
  id: `j${i}`, home: `Team A${i}`, away: `Team B${i}`, time: 'Sat 15:00', odds: { home: 1.90, draw: 3.20, away: 3.80 }
}));

const liveScores = [
  { id: 's1', home: 'Dortmund', away: 'Leipzig', score: '1 - 0', minute: "42'" },
  { id: 's2', home: 'PSG', away: 'Marseille', score: '3 - 1', minute: "78'" },
];

export default function Home() {
  const { selections, stake, mode, setStake, toggleMode, removeSelection, clearBetslip, placeBet, claimDailyBonus, hasClaimedBonus, quickBetEnabled, toggleQuickBet, quickBetStake, setQuickBetStake, totalWagered, addSelection, achievements, isCoolOffActive, applyPromoCode, activateCoolOff, deactivateCoolOff, currency, setCurrency, favorites, toggleFavorite, transactionPin, freeBetBalance, useFreeBet, toggleFreeBet, loadBookingCode, generateBookingCode } = useBetslipStore();
  
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
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
  const [bookingCode, setBookingCode] = useState("");
  
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authGhanaCard, setAuthGhanaCard] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // NEW STATES FOR TOP/SECONDARY NAV & TABBED MARKETS
  const [activeTopNav, setActiveTopNav] = useState<string>('Sports');
  const [activeSport, setActiveSport] = useState<string>('Football');
  const [activeMarketTab, setActiveMarketTab] = useState<'markets' | 'stats' | 'codes'>('markets');
  const [activeMarketFilter, setActiveMarketFilter] = useState<'all' | 'main' | 'goals' | 'corners' | 'half' | 'players'>('all');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit' }));

  const [walletBalance, setWalletBalance] = useState<number>(() => { if (typeof window !== 'undefined') { const saved = localStorage.getItem('betnova_wallet'); return saved ? parseFloat(saved) : 1500; } return 1500; });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => { if (typeof window !== 'undefined') { return localStorage.getItem('betnova_logged_in') === 'true'; } return false; });
  const [matches, setMatches] = useState<MatchData[]>(initialMatches);
  const [lastGoal, setLastGoal] = useState<string | null>(null);

  const exchangeRates = { GHS: 1, USD: 0.08, EUR: 0.07 };
  const formatMoney = (amount: number) => `${currency} ${(amount * exchangeRates[currency]).toFixed(2)}`;

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
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setGeneratedCode(null); }, [selections]);

  useEffect(() => {
    const interval = setInterval(() => setCommentaryIndex(prev => (prev + 1) % liveCommentary.length), 8000);
    return () => clearInterval(interval);
  }, []);

  // NEW: GMT CLOCK TIMER
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT', hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

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
      return bFav - aFav;
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
          markets: { ...match.markets, main: { home: { ...match.markets.main.home, odds: fluctuate(match.markets.main.home.odds) }, draw: { ...match.markets.main.draw, odds: fluctuate(match.markets.main.draw.odds) }, away: { ...match.markets.main.away, odds: fluctuate(match.markets.main.away.odds) } }, extra: match.markets.extra ? { over: { ...match.markets.extra.over, odds: fluctuate(match.markets.extra.over.odds) }, under: { ...match.markets.extra.under, odds: fluctuate(match.markets.extra.under.odds) }, btts: { ...match.markets.extra.btts, odds: fluctuate(match.markets.extra.btts.odds) } } : undefined, special: match.markets.special }
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (lastGoal) { setNotification(`⚽ GOAL! ${lastGoal}`); setTimeout(() => setLastGoal(null), 4000); } }, [lastGoal]);

  const initiatePlaceBet = () => {
    if (isCoolOffActive) { setNotification("🔒 Account is in Cool-Off."); setTimeout(() => setNotification(null), 3000); return; }
    if (selections.length === 0) { setNotification("🚫 Please select an outcome!"); setTimeout(() => setNotification(null), 3000); return; }
    if (!useFreeBet && stake <= 0) { setNotification("🚫 Enter a valid stake!"); setTimeout(() => setNotification(null), 3000); return; }
    if (!useFreeBet && stake > walletBalance) { setNotification("🚫 Insufficient balance!"); setTimeout(() => setNotification(null), 3000); return; }
    setIsPinModalOpen(true);
    setPinInput("");
  };

  const confirmPlaceBet = () => {
    if (pinInput !== transactionPin) {
      setNotification("🚫 Incorrect Transaction PIN!");
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setIsPinModalOpen(false);
    if (!useFreeBet) setWalletBalance(prev => prev - stake);
    placeBet(totalOdds, potentialWin); 
    setNotification(`✅ Placed ${useFreeBet ? 'Free ' : ''}bet for GHS ${useFreeBet ? 0 : stake.toFixed(2)}!`);
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
      const bonus = depositAmount * 0.5;
      const totalAdded = depositAmount + bonus;
      setWalletBalance(prev => prev + totalAdded);
      setNotification(`✅ Deposited ${formatMoney(depositAmount)} + ${formatMoney(bonus)} Bonus!`);
      setTimeout(() => setNotification(null), 3000);
      setDepositAmount(0); setIsDepositOpen(false);
    }
  };

  const handleCopyExpertPick = (pick: typeof expertPicks[0]) => {
    addSelection({ id: pick.id, matchId: 'ep', matchName: pick.matchName, market: pick.market, outcome: pick.outcome, odds: pick.odds });
    setNotification(`📋 Copied Expert Pick!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'register' && !showOtpStep) {
      setShowOtpStep(true);
      setNotification("📱 OTP sent to your phone!");
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (authTab === 'forgot') {
      setNotification("✅ Password reset link sent!");
      setTimeout(() => { setNotification(null); setAuthTab('login'); setShowOtpStep(false); }, 2000);
      return;
    }
    setIsLoggedIn(true);
    localStorage.setItem('betnova_logged_in', 'true');
    setIsAuthOpen(false);
    setAuthTab('login');
    setShowOtpStep(false);
    setNotification("✅ Welcome back, Harriette!");
    setTimeout(() => setNotification(null), 3000);
  };

  // NEW: FUNCTION TO RENDER MAIN AREA BASED ON TOP NAV
  const renderMainArea = () => {
    switch (activeTopNav) {
      case 'Sports':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="hidden lg:block lg:col-span-3 space-y-4">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Popular Sports</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center justify-between p-2 rounded-md bg-gray-950 border border-gray-800 text-white cursor-pointer hover:border-green-500 transition-colors"><span>⚽ Soccer</span><span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse font-bold">142</span></li>
                  <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-950 cursor-pointer transition-colors"><span>🏀 Basketball</span><span className="text-xs">45</span></li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-lg border border-green-500/30 p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-green-500" /> Expert Picks</h3>
                <div className="space-y-3">
                  {expertPicks.map((pick) => (
                    <div key={pick.id} className="bg-gray-950/50 p-3 rounded border border-gray-800">
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{pick.confidence} Confidence</span>
                      <p className="text-xs text-gray-400 my-1">{pick.matchName}</p>
                      <div className="flex items-center justify-between"><span className="text-sm font-medium text-white">{pick.outcome}</span><span className="text-sm font-bold text-green-500">{pick.odds.toFixed(2)}</span></div>
                      <button onClick={() => handleCopyExpertPick(pick)} className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white text-xs font-bold rounded transition-colors"><Copy className="w-3 h-3" /> Copy to Betslip</button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-6 space-y-6">
              <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                {carouselImages.map((img, index) => (
                  <div key={img.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">{img.title}</h3>
                      <p className="text-sm md:text-base text-green-400 font-medium drop-shadow-md">{img.subtitle}</p>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                  {carouselImages.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-green-500 w-6' : 'bg-white/50 w-2'}`} />
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/40 to-gray-900 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="p-2 bg-green-500/20 rounded-lg"><Zap className="w-6 h-6 text-green-500" /></div><div><h3 className="font-bold text-white text-sm">⚡ 10% Acca Boost!</h3><p className="text-xs text-gray-400">Get 10% extra on your winnings for 5+ selections.</p></div></div>
                <button className="px-4 py-2 bg-green-500 text-gray-950 text-xs font-bold rounded-md hover:bg-green-600 transition-colors">Claim Now</button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[{ id: 'all', label: '🔥 All' }, { id: 'live', label: '🔴 Live' }, { id: 'soccer', label: '⚽ Soccer' }, { id: 'basketball', label: '🏀 Basketball' }].map((filter) => (
                  <button key={filter.id} onClick={() => setActiveFilter(filter.id as any)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === filter.id ? 'bg-green-500 text-gray-950 shadow-lg shadow-green-500/20' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>{filter.label}</button>
                ))}
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Search teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>

              {sortedAndFilteredMatches.length === 0 ? (<div className="text-center py-12 text-gray-500">No matches found</div>) : (
                sortedAndFilteredMatches.map((match) => (
                  <div key={match.id} className="bg-gray-900 rounded-lg border border-gray-800 p-4 space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className={match.status.includes("World Cup") ? "text-yellow-400 font-bold" : ""}>{match.status}</span>
                      <div className="flex gap-2">
                        {match.isLive && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
                        {match.isLive && <button onClick={() => setIsWatchLiveOpen(match.id)} className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-blue-700"><Play className="w-3 h-3 fill-white" /> Watch</button>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-white">{match.home}</p>
                          <button onClick={() => toggleFavorite(match.id)} className="hover:scale-110 transition-transform">
                            <Star className={`w-4 h-4 ${favorites.includes(match.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                          </button>
                          <div className="flex gap-1">{match.form.map((result, i) => (<span key={i} className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded ${result === 'W' ? 'bg-green-500/20 text-green-500' : result === 'D' ? 'bg-gray-500/20 text-gray-400' : 'bg-red-500/20 text-red-500'}`}>{result}</span>))}</div>
                        </div>
                        <p className="font-semibold text-white mt-1">{match.away}</p>
                      </div>
                      <div className={`text-2xl font-bold px-4 transition-colors duration-500 ${match.isLive ? 'text-green-500' : 'text-gray-500'}`}>{match.score}</div>
                    </div>
                    
                    {match.isLive && (
                      <div className="bg-gray-950 border border-gray-800 rounded p-2 flex items-center gap-2 text-xs">
                        <span className="text-green-500 font-bold animate-pulse">● LIVE</span>
                        <span className="text-gray-400 truncate">{liveCommentary[commentaryIndex]}</span>
                      </div>
                    )}

                    {/* NEW: TABBED MARKET INTERFACE */}
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex gap-4 mb-3 border-b border-gray-800">
                        {(['markets', 'stats', 'codes'] as const).map((tab) => (
                          <button 
                            key={tab} 
                            onClick={() => setActiveMarketTab(tab)}
                            className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${activeMarketTab === tab ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {tab === 'markets' && <TrendingUp className="w-3 h-3" />}
                            {tab === 'stats' && <BarChart3 className="w-3 h-3" />}
                            {tab === 'codes' && <ClipboardList className="w-3 h-3" />}
                            {tab}
                          </button>
                        ))}
                      </div>

                      {activeMarketTab === 'markets' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                            {(['all', 'main', 'goals', 'corners', 'half', 'players'] as const).map(f => (
                              <button key={f} onClick={() => setActiveMarketFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${activeMarketFilter === f ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                              </button>
                            ))}
                          </div>

                          {(activeMarketFilter === 'all' || activeMarketFilter === 'main') && (
                            <div className="grid grid-cols-3 gap-2">
                              <OddsButton selection={match.markets.main.home} />
                              <OddsButton selection={match.markets.main.draw} />
                              <OddsButton selection={match.markets.main.away} />
                            </div>
                          )}

                          {(activeMarketFilter === 'all' || activeMarketFilter === 'goals') && match.markets.extra && (
                            <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
                              <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Goals & BTTS</p>
                              <div className="grid grid-cols-3 gap-2">
                                <OddsButton selection={match.markets.extra.over} />
                                <OddsButton selection={match.markets.extra.under} />
                                <OddsButton selection={match.markets.extra.btts} />
                              </div>
                            </div>
                          )}

                          {(activeMarketFilter === 'all' || activeMarketFilter === 'main') && match.markets.special && (
                            <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
                              <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Double Chance</p>
                              <div className="grid grid-cols-2 gap-2">
                                <OddsButton selection={match.markets.special.dc1x} />
                                <OddsButton selection={match.markets.special.dcx2} />
                              </div>
                            </div>
                          )}
                          
                          {(activeMarketFilter === 'corners' || activeMarketFilter === 'half' || activeMarketFilter === 'players') && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              More {activeMarketFilter} markets coming soon!
                            </div>
                          )}
                        </div>
                      )}

                      {activeMarketTab === 'stats' && (
                        <div className="bg-gray-950 rounded-lg p-3 border border-gray-800 animate-in fade-in slide-in-from-top-2">
                          <p className="text-sm text-gray-300 mb-3">📊 {match.stats}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400"><span>Possession</span><span>55% - 45%</span></div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '55%' }}></div></div>
                          </div>
                        </div>
                      )}

                      {activeMarketTab === 'codes' && (
                        <div className="bg-gray-950 rounded-lg p-3 border border-gray-800 animate-in fade-in slide-in-from-top-2 text-center">
                          <p className="text-sm text-gray-400 mb-2">Share this match as a booking code</p>
                          <button onClick={() => { addSelection(match.markets.main.home); setNotification("📋 Added to betslip to generate code!"); setTimeout(() => setNotification(null), 2000); }} className="px-4 py-2 bg-gray-800 hover:bg-green-600 text-white rounded text-xs font-bold transition-colors">
                            Add to Betslip to Share
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </section>

            <aside id="mobile-betslip" className="lg:col-span-3">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">Betslip {selections.length > 0 && <span className="bg-green-500 text-gray-950 text-xs px-2 py-0.5 rounded-full font-bold">{selections.length}</span>}</h3>
                  {selections.length > 0 && (<button onClick={handleShareBetslip} className="text-gray-400 hover:text-green-500 transition-colors"><Share2 className="w-4 h-4" /></button>)}
                </div>

                <div className="mb-4 p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-white">Load Booking Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={bookingCode} onChange={(e) => setBookingCode(e.target.value.toUpperCase())} placeholder="e.g. WC2026" className="flex-1 h-8 rounded bg-gray-900 border border-gray-800 text-xs text-white px-2 focus:outline-none focus:ring-1 focus:ring-green-500 uppercase" />
                    <button onClick={() => loadBookingCode(bookingCode)} className="h-8 px-3 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700">Load</button>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-white flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Quick Bet</span><button onClick={toggleQuickBet} className={`w-10 h-5 rounded-full relative transition-colors ${quickBetEnabled ? 'bg-green-500' : 'bg-gray-700'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${quickBetEnabled ? 'left-5' : 'left-0.5'}`} /></button></div>
                  {quickBetEnabled && (<div className="flex items-center gap-2"><span className="text-xs text-gray-400">Stake:</span><input type="number" value={quickBetStake} onChange={(e) => setQuickBetStake(parseFloat(e.target.value) || 0)} className="w-20 h-7 rounded bg-gray-900 border border-gray-800 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-green-500" /><span className="text-xs text-gray-500">{currency}</span></div>)}
                </div>

                <div className="space-y-3 mb-4 min-h-[100px]">
                  {selections.length === 0 ? (<p className="text-center text-gray-500 text-sm py-8">Click an odd to add to your betslip</p>) : (
                    selections.map((sel) => (
                      <div key={sel.id} className="bg-gray-950 p-3 rounded border border-gray-800 relative group">
                        <button onClick={() => removeSelection(sel.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                        <span className="text-xs text-gray-500">{sel.market}</span><p className="text-sm font-medium text-white mb-1">{sel.matchName}</p><p className="text-xs text-gray-400 mb-2">{sel.outcome}</p><span className="text-green-500 font-bold">{sel.odds.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                {selections.length > 0 && (
                  <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1"><Ticket className="w-3 h-3 text-blue-400" /> Share Betslip</span>
                    </div>
                    {generatedCode ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-900 border border-green-500/30 rounded p-2 text-center">
                          <p className="text-[10px] text-gray-400">Your Booking Code</p>
                          <p className="text-lg font-bold text-green-400 tracking-wider">{generatedCode}</p>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(generatedCode); setNotification("📋 Code copied!"); setTimeout(() => setNotification(null), 2000); }} className="h-12 px-3 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors">Copy</button>
                      </div>
                    ) : (
                      <button onClick={() => { const code = generateBookingCode(); setGeneratedCode(code); }} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-3 h-3" /> Generate Booking Code
                      </button>
                    )}
                  </div>
                )}

                {selections.length > 0 && (
                  <div className="space-y-3 border-t border-gray-800 pt-4">
                    {freeBetBalance > 0 && (
                      <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-bold text-green-400">Use Free Bet (GHS {freeBetBalance.toFixed(2)})</span>
                        </div>
                        <button onClick={toggleFreeBet} className={`w-10 h-5 rounded-full relative transition-colors ${useFreeBet ? 'bg-green-500' : 'bg-gray-700'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${useFreeBet ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    )}

                    {!useFreeBet && (
                      <>
                        <div className="flex gap-2">{[10, 50, 100].map((amt) => (<button key={amt} onClick={() => setStake(amt)} className="flex-1 py-1 text-xs font-bold bg-gray-800 text-gray-300 rounded hover:bg-green-600 hover:text-white transition-colors">{formatMoney(amt)}</button>))}<button onClick={() => setStake(walletBalance)} className="flex-1 py-1 text-xs font-bold bg-gray-800 text-gray-300 rounded hover:bg-green-600 hover:text-white transition-colors">MAX</button></div>
                        <div><label className="text-xs text-gray-400 mb-1 block">Stake ({currency})</label><input type="number" placeholder="0.00" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-right font-bold" value={stake === 0 ? '' : stake} onChange={(e) => setStake(parseFloat(e.target.value) || 0)} /></div>
                      </>
                    )}
                    
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Total Odds:</span><span className="text-white font-bold">{totalOdds.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Potential Win:</span><span className="text-green-500 font-bold">{formatMoney(potentialWin)}</span></div>
                    <button disabled={isCoolOffActive} className={`w-full h-12 px-8 rounded-md font-bold text-base transition-colors flex items-center justify-center gap-2 ${isCoolOffActive ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-gray-950 hover:bg-green-600'}`} onClick={initiatePlaceBet}>
                      <Lock className="w-4 h-4" /> {isCoolOffActive ? 'Cool-Off Active' : 'Place Bet'}
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        );
      
      case 'Jackpot':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Trophy className="w-4 h-4" /> Mega Jackpot (12 Games)</h3>
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="grid grid-cols-5 bg-gray-950 p-2 text-xs font-bold text-gray-400 text-center">
                <span className="col-span-2 text-left">Match</span><span>1</span><span>X</span><span>2</span>
              </div>
              {jackpotMatches.map(m => (
                <div key={m.id} className="grid grid-cols-5 p-2 border-t border-gray-800 text-xs items-center">
                  <div className="col-span-2"><div className="text-white font-medium">{m.home}</div><div className="text-white font-medium">{m.away}</div></div>
                  <button className="p-2 rounded bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700">{m.odds.home.toFixed(2)}</button>
                  <button className="p-2 rounded bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700">{m.odds.draw.toFixed(2)}</button>
                  <button className="p-2 rounded bg-gray-800 text-yellow-400 font-bold hover:bg-gray-700">{m.odds.away.toFixed(2)}</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Livescore':
        return (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-green-500 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Live Scores</h3>
            {liveScores.map(m => (
              <div key={m.id} className="bg-gray-900 rounded-lg p-3 border border-gray-800 flex justify-between items-center">
                <div className="flex-1"><div className="text-white font-bold">{m.home}</div><div className="text-white font-bold">{m.away}</div></div>
                <div className="text-center px-4"><div className="text-green-500 font-bold text-lg">{m.score}</div><div className="text-xs text-gray-400">{m.minute}</div></div>
              </div>
            ))}
          </div>
        );

      case 'Promotions':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><Gift className="w-4 h-4" /> Promotions</h3>
            <div className="bg-gradient-to-r from-green-900/40 to-gray-900 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-bold text-white text-lg mb-1">100% First Deposit Bonus</h4>
              <p className="text-gray-400 text-sm mb-3">Get up to GHS 1,000 extra on your first deposit!</p>
              <button className="px-4 py-2 bg-green-500 text-gray-950 font-bold text-xs rounded hover:bg-green-600 transition-colors">Claim Now</button>
            </div>
          </div>
        );

      case 'Sporty Loyalty':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Star className="w-4 h-4" /> Sporty Loyalty</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-center">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3"><Star className="w-8 h-8 text-yellow-400 fill-yellow-400" /></div>
              <h4 className="text-white font-bold text-lg">Silver Tier</h4>
              <p className="text-gray-400 text-xs mb-4">1,250 / 5,000 Points to Gold</p>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: '25%' }}></div></div>
              <p className="text-green-500 text-xs font-bold">Keep betting to unlock exclusive rewards!</p>
            </div>
          </div>
        );

      case 'App':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-green-500 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Get the App</h3>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
              <p className="text-gray-400 mb-4">Download the BetNova app for the fastest betting experience.</p>
              <div className="flex flex-col gap-3">
                <button className="w-full py-3 bg-green-500 text-gray-950 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"><Smartphone className="w-5 h-5" /> Download for Android</button>
                <button className="w-full py-3 bg-green-500 text-gray-950 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"><Smartphone className="w-5 h-5" /> Download for iOS</button>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg inline-block"><Grid3X3 className="w-24 h-24 text-gray-900" /><p className="text-gray-900 text-xs font-bold mt-1">Scan QR Code</p></div>
            </div>
          </div>
        );

      case 'GMT+00:00':
        return (
          <div className="animate-in fade-in slide-in-from-top-2">
            <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Timezone</h3>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-2">Current Server Time (GMT)</p>
              <p className="text-green-500 text-4xl font-bold tracking-widest">{currentTime}</p>
            </div>
          </div>
        );

      case 'Games':
      case 'Live Betting':
      case 'Scheduled Virtuals':
      case 'Results':
        return (
          <div className="text-center py-12 text-gray-500 animate-in fade-in slide-in-from-top-2">
            <p>{activeTopNav} content will appear here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24 lg:pb-0">
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 25s linear infinite; }`}</style>

      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-800 rounded-md text-gray-400">{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
            <h1 className="text-2xl font-bold tracking-tight text-green-500">BET<span className="text-white">NOVA</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link href="/" className="text-white hover:text-green-500 transition-colors">Sports</Link>
            <Link href="/" className="hover:text-green-500 transition-colors">Live Betting</Link>
            <Link href="/my-bets" className="hover:text-green-500 transition-colors">My Bets</Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="hidden md:flex items-center gap-1 h-9 px-3 bg-gray-950 border border-gray-800 rounded-md font-bold text-xs hover:border-green-500 transition-colors text-gray-300">
                <Globe className="w-3 h-3" /> {currency}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {(['GHS', 'USD', 'EUR'] as const).map((c) => (
                  <button key={c} onClick={() => setCurrency(c)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 ${currency === c ? 'text-green-500 font-bold' : 'text-gray-300'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-gray-950 border border-gray-800 px-3 py-2 rounded-lg">
              <span className="text-xs text-gray-400">Balance:</span>
              <span className="text-sm font-bold text-green-500">{formatMoney(walletBalance)}</span>
            </div>
            <button onClick={() => setIsDepositOpen(true)} className="hidden md:flex h-9 px-3 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700 transition-colors">+ Deposit</button>
            
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 hover:bg-gray-800 rounded-md text-gray-400 relative"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-800 flex justify-between items-center"><h3 className="font-bold text-white">Notifications</h3><button onClick={() => setIsNotifOpen(false)}><X className="w-4 h-4 text-gray-400" /></button></div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"><p className="text-sm font-medium text-white">⚽ Goal! Real Madrid scores!</p><p className="text-xs text-gray-500 mt-1">2 mins ago</p></div>
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative group">
                <button className="hidden sm:flex h-10 px-4 py-2 bg-gray-800 text-white rounded-md font-bold text-sm hover:bg-gray-700 transition-colors items-center gap-2">
                  <User className="h-4 w-4" /> Hi, Harriette!
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${vipTier.bg} ${vipTier.color} border border-current/20`}>{vipTier.icon} {vipTier.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-xs text-gray-400">Total Wagered</p>
                    <p className="text-sm font-bold text-white">{formatMoney(totalWagered)}</p>
                  </div>
                  <button onClick={() => setIsCoolOffModalOpen(true)} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Cool-Off</button>
                  <button onClick={() => { setIsLoggedIn(false); localStorage.removeItem('betnova_logged_in'); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="hidden sm:flex h-10 px-4 py-2 bg-green-500 text-gray-950 rounded-md font-bold text-sm hover:bg-green-600 transition-colors">Login / Register</button>
            )}
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 border-b border-gray-800 p-4 space-y-4 z-40 shadow-xl animate-in slide-in-from-top-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white font-medium py-2 border-b border-gray-800">Sports</Link>
            <Link href="/my-bets" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-400 py-2">My Bets</Link>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800"><span className="text-sm text-gray-400">Balance:</span><span className="text-sm font-bold text-green-500">{formatMoney(walletBalance)}</span></div>
          </div>
        )}
      </header>

      <div className="bg-green-900/20 border-b border-green-500/20 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-marquee">{[...recentWinners, ...recentWinners].map((winner, i) => (<span key={i} className="mx-8 text-sm font-medium text-green-400 flex items-center gap-2"><Trophy className="w-4 h-4" /> {winner}</span>))}</div>
      </div>

      {/* NEW: TOP NAVIGATION BAR */}
      <div className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-2 min-w-max">
          {['Sports', 'Games', 'Live Betting', 'Scheduled Virtuals', 'Jackpot', 'Livescore', 'Results', 'Promotions', 'Sporty Loyalty', 'App', 'GMT+00:00'].map((item) => (
            <button key={item} onClick={() => setActiveTopNav(item)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all min-h-[44px] ${activeTopNav === item ? 'bg-green-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'}`}>
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

      {/* NEW: SECONDARY NAVIGATION BAR */}
      <div className="sticky top-[72px] z-30 bg-gray-900 border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 py-2 gap-3 min-w-max">
          {['Home', 'Football', 'vFootball', 'Basketball', 'Tennis', 'eFootball', 'Table Tennis', 'eBasketball', 'Ice Hockey', 'Handball', 'More Sports'].map((sport) => (
            <button key={sport} onClick={() => setActiveSport(sport)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[60px] min-h-[44px] transition-all ${activeSport === sport ? 'text-green-500 bg-green-500/10' : 'text-gray-500 hover:text-gray-300'}`}>
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

      {selections.length > 0 && (
        <div className="md:hidden fixed bottom-20 left-0 w-full bg-gray-900 border-t border-gray-800 p-4 z-40 flex items-center justify-between shadow-2xl">
          <div><p className="text-xs text-gray-400">{selections.length} Selection(s)</p><p className="text-green-500 font-bold">{formatMoney(potentialWin)}</p></div>
          <button onClick={() => { document.getElementById('mobile-betslip')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="bg-green-500 text-gray-950 px-6 py-2 rounded-md font-bold text-sm hover:bg-green-600 transition-colors">View Betslip</button>
        </div>
      )}

      {notification && (<div className="fixed top-20 right-4 z-[110] bg-green-500 text-gray-950 px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 animate-bounce">{notification}</div>)}

      <main className="container mx-auto px-4 py-8">
        {renderMainArea()}
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500"><p className="mb-2">18+ Play Responsibly. Licensed by the Gaming Commission.</p><p>© 2026 BetNova. All rights reserved.</p></div>
      </footer>

      {isPinModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <Lock className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Enter Transaction PIN</h2>
            <p className="text-sm text-gray-400 mb-6">For your security, please enter your 4-digit PIN to confirm this bet.</p>
            <input type="password" maxLength={4} value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} placeholder="****" className="flex h-14 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-2xl text-white text-center tracking-[1em] focus:outline-none focus:ring-2 focus:ring-green-500 mb-4" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => setIsPinModalOpen(false)} className="flex-1 h-11 bg-gray-800 text-gray-300 rounded-md font-bold hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={confirmPlaceBet} className="flex-1 h-11 bg-green-500 text-gray-950 rounded-md font-bold hover:bg-green-600 transition-colors">Confirm</button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Default PIN is <span className="text-gray-300">1234</span></p>
          </div>
        </div>
      )}

      {isAuthOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setIsAuthOpen(false); setShowOtpStep(false); setAuthTab('login'); }} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => { setIsAuthOpen(false); setShowOtpStep(false); setAuthTab('login'); }} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            
            {showOtpStep ? (
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-sm text-gray-400 mb-6">Enter the 6-digit code sent to {authPhone || 'your phone'}.</p>
                <input type="text" maxLength={6} value={authOtp} onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="flex h-14 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-2xl text-white text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-green-500 mb-6" autoFocus />
                <button onClick={handleAuthSubmit} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors">Verify & Continue</button>
                <button onClick={() => setShowOtpStep(false)} className="w-full mt-3 text-sm text-gray-400 hover:text-white">Change Phone Number</button>
              </div>
            ) : authTab === 'forgot' ? (
              <div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">Forgot Password</h2>
                <p className="text-sm text-gray-400 mb-6 text-center">Enter your registered phone number to reset your password.</p>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div><label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label><input type="tel" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="024XXXXXXX" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" required /></div>
                  <button type="submit" className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors mt-2">Send Reset Code</button>
                </form>
                <button onClick={() => setAuthTab('login')} className="w-full mt-4 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to Login</button>
              </div>
            ) : (
              <div>
                <div className="flex border-b border-gray-800 mb-6">
                  <button onClick={() => setAuthTab('login')} className={`flex-1 pb-3 text-sm font-bold transition-colors ${authTab === 'login' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}>Log In</button>
                  <button onClick={() => setAuthTab('register')} className={`flex-1 pb-3 text-sm font-bold transition-colors ${authTab === 'register' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}>Register</button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authTab === 'register' && (
                    <>
                      <div><label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label><input type="text" placeholder="Kwame Mensah" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" required /></div>
                      <div><label className="block text-xs font-medium text-gray-400 mb-1">Ghana Card Number (NIA)</label><input type="text" value={authGhanaCard} onChange={(e) => setAuthGhanaCard(e.target.value.toUpperCase())} placeholder="GHA-123456789-0" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-green-500" required /></div>
                    </>
                  )}
                  <div><label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label><input type="tel" value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="024XXXXXXX" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" required /></div>
                  <div><label className="block text-xs font-medium text-gray-400 mb-1">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" required /></div>
                  
                  {authTab === 'login' && (
                    <div className="text-right"><button type="button" onClick={() => setAuthTab('forgot')} className="text-xs text-green-500 hover:text-green-400">Forgot Password?</button></div>
                  )}

                  <button type="submit" className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors mt-2">
                    {authTab === 'register' ? 'Create Account' : 'Log In'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isDepositOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDepositOpen(false)} /><div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl"><button onClick={() => setIsDepositOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button><h2 className="text-2xl font-bold text-white mb-2">Deposit Funds</h2>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
          <Gift className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div><p className="text-sm font-bold text-green-400">🎁 50% First Deposit Bonus!</p><p className="text-xs text-gray-400">Deposit GHS 100, get GHS 150 in your wallet.</p></div>
        </div>
        <div className="mb-4"><label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Promo Code</label><div className="flex gap-2"><input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. WELCOME50" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white uppercase focus:outline-none focus:ring-2 focus:ring-green-500" /><button onClick={() => applyPromoCode(promoInput)} className="h-10 px-4 bg-green-600 text-white rounded-md font-bold text-xs hover:bg-green-700">Apply</button></div></div><div className="grid grid-cols-3 gap-2 mb-4">{[10, 50, 100, 200, 500, 1000].map((amt) => (<button key={amt} onClick={() => setDepositAmount(amt)} className={`py-2 rounded-md font-bold border transition-colors ${depositAmount === amt ? 'bg-green-500 border-green-500 text-gray-950' : 'bg-gray-950 border-gray-800 text-white hover:border-green-500'}`}>{formatMoney(amt)}</button>))}</div><div className="mb-6"><label className="block text-xs font-medium text-gray-400 mb-1">Custom Amount</label><input type="number" value={depositAmount || ''} onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)} className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" /></div><button onClick={handleDeposit} disabled={depositAmount <= 0} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Deposit</button></div></div>
      )}

      {isCoolOffModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCoolOffModalOpen(false)} /><div className="relative bg-gray-900 border-2 border-red-500/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"><ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-white mb-2">Self-Exclusion / Cool-Off</h2><p className="text-sm text-gray-400 mb-6">Temporarily lock your account to play responsibly.</p><div className="grid grid-cols-3 gap-2 mb-4">{[{h:24, l:'24h'}, {h:168, l:'7 Days'}, {h:720, l:'30 Days'}].map((c) => (<button key={c.h} onClick={() => { activateCoolOff(c.h); setIsCoolOffModalOpen(false); }} className="py-2 rounded-md font-bold bg-gray-800 text-white hover:bg-red-500 transition-colors">{c.l}</button>))}</div><button onClick={deactivateCoolOff} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors mb-2">Unlock Early</button><button onClick={() => setIsCoolOffModalOpen(false)} className="w-full h-11 bg-gray-800 text-gray-300 rounded-md font-bold text-base hover:bg-gray-700 transition-colors">Cancel</button></div></div>
      )}

      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 z-50 pb-4">
        <div className="container mx-auto max-w-lg flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-green-500 hover:text-green-400 transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-[10px] font-bold">Sports</span>
          </Link>
          <Link href="/games" className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
            <Gamepad2 className="w-6 h-6" />
            <span className="text-[10px] font-bold">Games</span>
          </Link>
          <Link href="/withdraw" className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] font-bold">Withdraw</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </div>
      </nav>

      <div className="fixed bottom-24 right-6 z-50 lg:bottom-6">
        {isChatOpen && (<div className="mb-4 w-80 h-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"><div className="bg-green-600 p-4 flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div><h3 className="font-bold text-white text-sm">BetNova Support</h3></div><button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button></div><div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-950"><div className="bg-gray-800 text-white text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">👋 Hi Harriette! Welcome to BetNova. How can we help you today?</div></div><div className="p-3 border-t border-gray-800 bg-gray-900"><div className="flex gap-2"><input type="text" placeholder="Type a message..." className="flex-1 h-9 rounded-md bg-gray-950 border border-gray-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500" /><button className="h-9 px-3 bg-green-500 text-gray-950 rounded-md font-bold text-xs hover:bg-green-600">Send</button></div></div></div>)}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-green-500 text-gray-950 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110">{isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}</button>
      </div>
    </div>
  );
}
