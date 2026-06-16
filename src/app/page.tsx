"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OddsButton } from "../features/OddsButton";
import { useBetslipStore } from "../store/useBetslipStore";
import { TrendingUp, Menu, User, X, MessageCircle, Share2, BarChart3, Gift, ChevronDown, ChevronUp, Zap } from "lucide-react";

const initialMatches = [
  { 
    id: '1', home: 'Real Madrid', away: 'Manchester City', score: '2 - 1', status: "Champions League • 67'", isLive: true, sport: 'soccer',
    stats: "Real Madrid has won 4 of their last 5 matches.", 
    markets: {
      main: { home: { id: '1-1', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Real Madrid (1)', odds: 2.45 }, draw: { id: '1-x', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.10 }, away: { id: '1-2', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Match Winner', outcome: 'Man City (2)', odds: 2.80 } },
      extra: { over: { id: '1-o', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.85 }, under: { id: '1-u', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.95 }, btts: { id: '1-b', matchId: '1', matchName: 'Real Madrid vs Man City', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.70 } }
    }
  },
  { 
    id: '2', home: 'Arsenal', away: 'Liverpool', score: 'VS', status: "Premier League • Today 20:00", isLive: false, sport: 'soccer',
    stats: "Head-to-Head: Arsenal 2 - 3 Liverpool (Last 5)",
    markets: {
      main: { home: { id: '2-1', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Arsenal (1)', odds: 2.10 }, draw: { id: '2-x', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Draw (X)', odds: 3.40 }, away: { id: '2-2', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Match Winner', outcome: 'Liverpool (2)', odds: 3.25 } },
      extra: { over: { id: '2-o', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Total Goals', outcome: 'Over 2.5', odds: 1.90 }, under: { id: '2-u', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Total Goals', outcome: 'Under 2.5', odds: 1.90 }, btts: { id: '2-b', matchId: '2', matchName: 'Arsenal vs Liverpool', market: 'Both Teams to Score', outcome: 'Yes', odds: 1.65 } }
    }
  },
  { 
    id: '3', home: 'LA Lakers', away: 'Boston Celtics', score: '88 - 92', status: "NBA • 3rd Qtr", isLive: true, sport: 'basketball',
    stats: "Celtics are on a 12-0 run in the 3rd quarter.",
    markets: {
      main: { home: { id: '3-1', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Lakers (1)', odds: 1.90 }, draw: { id: '3-x', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Draw (X)', odds: 15.00 }, away: { id: '3-2', matchId: '3', matchName: 'Lakers vs Celtics', market: 'Match Winner', outcome: 'Celtics (2)', odds: 1.95 } }
    }
  }
];

export default function Home() {
  const { selections, stake, mode, setStake, removeSelection, clearBetslip, placeBet, claimDailyBonus, hasClaimedBonus } = useBetslipStore();
  
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1500);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [openStatsId, setOpenStatsId] = useState<string | null>(null);
  const [openMarketsId, setOpenMarketsId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [matches, setMatches] = useState(initialMatches);
  const [lastGoal, setLastGoal] = useState<string | null>(null);

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = stake * totalOdds;

  useEffect(() => {
    if (!hasClaimedBonus) {
      setTimeout(() => {
        setShowBonusModal(true);
        claimDailyBonus();
        setWalletBalance(prev => prev + 25);
      }, 1500);
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

        return { ...match, score: newScore, status: newStatus };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastGoal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-20 lg:pb-0">
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
            <button className="p-2 hover:bg-gray-800 rounded-md text-gray-400"><User className="h-5 w-5" /></button>
            {isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(false)} className="hidden sm:flex h-10 px-4 py-2 bg-gray-800 text-white rounded-md font-bold text-sm hover:bg-gray-700 transition-colors items-center gap-2">
                <User className="h-4 w-4" /> Hi, Harriette!
              </button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hidden sm:flex h-10 px-4 py-2 bg-green-500 text-gray-950 rounded-md font-bold text-sm hover:bg-green-600 transition-colors">Login</button>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 border-b border-gray-800 p-4 space-y-4 z-40 shadow-xl animate-in slide-in-from-top-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-white font-medium py-2 border-b border-gray-800">Sports</Link>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-400 py-2 border-b border-gray-800">Live Betting</Link>
            <Link href="/my-bets" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-400 py-2">My Bets</Link>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-sm text-gray-400">Balance:</span>
              <span className="text-sm font-bold text-green-500">GHS {walletBalance.toFixed(2)}</span>
            </div>
          </div>
        )}
      </header>

      {selections.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 p-4 z-40 flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-xs text-gray-400">{selections.length} Selection(s)</p>
            <p className="text-green-500 font-bold">GHS {potentialWin.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => {
              document.getElementById('mobile-betslip')?.scrollIntoView({ behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }} 
            className="bg-green-500 text-gray-950 px-6 py-2 rounded-md font-bold text-sm hover:bg-green-600 transition-colors"
          >
            View Betslip
          </button>
        </div>
      )}

      {notification && (
        <div className="fixed top-20 right-4 z-110 bg-green-500 text-gray-950 px-6 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 animate-bounce">
          {notification}
        </div>
      )}

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Popular Sports</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center justify-between p-2 rounded-md bg-gray-950 border border-gray-800 text-white cursor-pointer hover:border-green-500 transition-colors"><span>⚽ Soccer</span><span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse font-bold">142</span></li>
              <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-950 cursor-pointer transition-colors"><span>🏀 Basketball</span><span className="text-xs">45</span></li>
              <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-950 cursor-pointer transition-colors"><span>🎾 Tennis</span><span className="text-xs">28</span></li>
            </ul>
          </div>
        </aside>

        <section className="lg:col-span-6 space-y-6">
          <div className="bg-linear-to-r from-green-900/40 to-gray-900 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg"><Zap className="w-6 h-6 text-green-500" /></div>
              <div>
                <h3 className="font-bold text-white text-sm">⚡ 10% Acca Boost!</h3>
                <p className="text-xs text-gray-400">Get 10% extra on your winnings for 5+ selections.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-500 text-gray-950 text-xs font-bold rounded-md hover:bg-green-600 transition-colors">Claim Now</button>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Live Matches</h2>
            <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">LIVE NOW</span>
          </div>

          {matches.map((match) => (
            <div key={match.id} className="bg-gray-900 rounded-lg border border-gray-800 p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{match.status}</span>
                {match.isLive && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-white">{match.home}</p>
                  <p className="font-semibold text-white mt-1">{match.away}</p>
                </div>
                <div className={`text-2xl font-bold px-4 transition-colors duration-500 ${match.isLive ? 'text-green-500' : 'text-gray-500'}`}>{match.score}</div>
              </div>
              
              <button onClick={() => setOpenStatsId(openStatsId === match.id ? null : match.id)} className="flex items-center gap-2 text-xs text-green-500 hover:text-green-400 transition-colors font-medium">
                <BarChart3 className="w-3 h-3" /> {openStatsId === match.id ? 'Hide Stats' : 'View Match Insights'}
              </button>
              {openStatsId === match.id && (
                <div className="bg-gray-950 border border-gray-800 rounded-md p-3 text-sm text-gray-300 animate-in fade-in slide-in-from-top-2">
                  📊 {match.stats}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                <OddsButton selection={match.markets.main.home} />
                <OddsButton selection={match.markets.main.draw} />
                <OddsButton selection={match.markets.main.away} />
              </div>

              {match.sport === 'soccer' && match.markets.extra && (
                <div>
                  <button 
                    onClick={() => setOpenMarketsId(openMarketsId === match.id ? null : match.id)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors font-medium mt-2"
                  >
                    {openMarketsId === match.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    More Markets (Over/Under, BTTS)
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
          ))}
        </section>

        <aside id="mobile-betslip" className="lg:col-span-3">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Betslip {selections.length > 0 && <span className="bg-green-500 text-gray-950 text-xs px-2 py-0.5 rounded-full font-bold">{selections.length}</span>}
              </h3>
              {selections.length > 0 && (
                <button onClick={handleShareBetslip} className="text-gray-400 hover:text-green-500 transition-colors" title="Share Betslip">
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-3 mb-4 min-h-25">
              {selections.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-8">Click an odd to add to your betslip</p>
              ) : (
                selections.map((sel) => (
                  <div key={sel.id} className="bg-gray-950 p-3 rounded border border-gray-800 relative group">
                    <button onClick={() => removeSelection(sel.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
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
                <div className="flex gap-2">
                  {[10, 50, 100].map((amt) => (
                    <button key={amt} onClick={() => setStake(amt)} className="flex-1 py-1 text-xs font-bold bg-gray-800 text-gray-300 rounded hover:bg-green-600 hover:text-white transition-colors">
                      GHS {amt}
                    </button>
                  ))}
                  <button onClick={() => setStake(walletBalance)} className="flex-1 py-1 text-xs font-bold bg-gray-800 text-gray-300 rounded hover:bg-green-600 hover:text-white transition-colors">
                    MAX
                  </button>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Stake (GHS)</label>
                  <input type="number" placeholder="0.00" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-right font-bold" value={stake === 0 ? '' : stake} onChange={(e) => setStake(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Total Odds:</span><span className="text-white font-bold">{totalOdds.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Potential Win:</span><span className="text-green-500 font-bold">GHS {potentialWin.toFixed(2)}</span></div>
                <button className="w-full h-12 px-8 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors" onClick={handlePlaceBet}>Place Bet</button>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p className="mb-2">18+ Play Responsibly. Licensed by the Gaming Commission.</p>
          <p>© 2026 BetNova. All rights reserved.</p>
        </div>
      </footer>

      {showBonusModal && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBonusModal(false)} />
          <div className="relative bg-gray-900 border-2 border-green-500 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Gift className="w-8 h-8 text-green-500" /></div>
            <h2 className="text-2xl font-bold text-white mb-2">Daily Bonus! 🎉</h2>
            <p className="text-gray-400 text-sm mb-6">Welcome back, Harriette! We&apos;ve added <span className="text-green-500 font-bold">GHS 25.00</span> to your wallet.</p>
            <button onClick={() => setShowBonusModal(false)} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors">Claim & Continue</button>
          </div>
        </div>
      )}

      {isDepositOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDepositOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => setIsDepositOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-white mb-2">Deposit Funds</h2>
            <p className="text-gray-400 text-sm mb-6">Add money to your BetNova wallet securely.</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[10, 50, 100, 200, 500, 1000].map((amt) => (
                <button key={amt} onClick={() => setDepositAmount(amt)} className={`py-2 rounded-md font-bold border transition-colors ${depositAmount === amt ? 'bg-green-500 border-green-500 text-gray-950' : 'bg-gray-950 border-gray-800 text-white hover:border-green-500'}`}>GHS {amt}</button>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 mb-1">Custom Amount</label>
              <input type="number" value={depositAmount || ''} onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)} className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <button onClick={() => { if (depositAmount > 0) { setWalletBalance(prev => prev + depositAmount); setNotification(`✅ Successfully deposited GHS ${depositAmount}!`); setTimeout(() => setNotification(null), 3000); setDepositAmount(0); setIsDepositOpen(false); } }} disabled={depositAmount <= 0} className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Deposit</button>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsLoginOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <div className="text-center mb-6"><h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2><p className="text-gray-400 text-sm">Log in to your BetNova account.</p></div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setIsLoginOpen(false); }}>
              <div><label className="block text-xs font-medium text-gray-400 mb-1">Email or Phone</label><input type="text" placeholder="user@example.com" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
              <div><label className="block text-xs font-medium text-gray-400 mb-1">Password</label><input type="password" placeholder="••••••••" className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
              <button type="submit" className="w-full h-11 bg-green-500 text-gray-950 rounded-md font-bold text-base hover:bg-green-600 transition-colors mt-2">Log In</button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (
          <div className="mb-4 w-80 h-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-green-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div><h3 className="font-bold text-white text-sm">BetNova Support</h3></div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-950">
              <div className="bg-gray-800 text-white text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">👋 Hi Harriette! Welcome to BetNova. How can we help you today?</div>
              <div className="bg-gray-800 text-white text-sm p-3 rounded-lg rounded-tl-none max-w-[80%]">You can ask us about deposits, withdrawals, or how to place a bet!</div>
            </div>
            <div className="p-3 border-t border-gray-800 bg-gray-900">
              <div className="flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 h-9 rounded-md bg-gray-950 border border-gray-800 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500" />
                <button className="h-9 px-3 bg-green-500 text-gray-950 rounded-md font-bold text-xs hover:bg-green-600">Send</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-green-500 text-gray-950 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110">
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}