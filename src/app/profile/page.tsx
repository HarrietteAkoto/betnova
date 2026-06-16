"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Crown, Trophy, ShieldAlert, LogOut, Settings } from "lucide-react";
import { useBetslipStore } from "../../store/useBetslipStore";

export default function ProfilePage() {
  const { totalWagered, achievements, isCoolOffActive, activateCoolOff, deactivateCoolOff } = useBetslipStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1500);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('betnova_logged_in') === 'true');
      setWalletBalance(parseFloat(localStorage.getItem('betnova_wallet') || '1500'));
    }
  }, []);

  const getVipTier = () => {
    if (totalWagered >= 2000) return { name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-400/20', icon: <Crown className="w-5 h-5 text-yellow-400" /> };
    if (totalWagered >= 500) return { name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-300/20', icon: <Crown className="w-5 h-5 text-gray-300" /> };
    return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: <Crown className="w-5 h-5 text-orange-400" /> };
  };
  const vipTier = getVipTier();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <User className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-4">Please log in to view your profile</h2>
        <Link href="/" className="px-6 py-3 bg-green-500 text-gray-950 rounded-md font-bold hover:bg-green-600">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-md"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"><User className="w-8 h-8 text-green-500" /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Harriette</h2>
            <p className="text-gray-400 text-sm">harriette@betnova.com</p>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mt-2 ${vipTier.bg} ${vipTier.color} border border-current/20`}>{vipTier.icon} {vipTier.name} Member</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Wallet Balance</p>
            <p className="text-xl font-bold text-green-500">GHS {walletBalance.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Wagered</p>
            <p className="text-xl font-bold text-white">GHS {totalWagered.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Achievements</h3>
          {achievements.length === 0 ? (<p className="text-gray-500 text-sm">No achievements yet. Place your first bet!</p>) : (
            <div className="flex flex-wrap gap-2">
              {achievements.map((badge, i) => (<span key={i} className="px-3 py-1.5 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">🏆 {badge}</span>))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800">
            <div className="flex items-center gap-3"><Settings className="w-5 h-5 text-gray-400" /><span className="text-sm font-medium">Account Settings</span></div>
          </button>
          <button onClick={() => isCoolOffActive ? deactivateCoolOff() : activateCoolOff(24)} className={`w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${isCoolOffActive ? 'text-red-400' : 'text-gray-300'}`}>
            <div className="flex items-center gap-3"><ShieldAlert className="w-5 h-5" /><span className="text-sm font-medium">{isCoolOffActive ? 'Unlock Account' : '24h Cool-Off'}</span></div>
          </button>
          <button onClick={() => { localStorage.removeItem('betnova_logged_in'); window.location.href = '/'; }} className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors text-red-400 border-t border-gray-800">
            <div className="flex items-center gap-3"><LogOut className="w-5 h-5" /><span className="text-sm font-medium">Log Out</span></div>
          </button>
        </div>
      </main>
    </div>
  );
}
