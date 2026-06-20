"use client";
import { useState } from "react";
import { Search, Bell, User, Wallet, Menu, X } from "lucide-react";
import { useBetslipStore } from "@/store/useBetslipStore";   // ← Fixed import

export default function Header() {
  const { walletBalance, currency = "GHS" } = useBetslipStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#0A0A0A] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo - SportyBet Style */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-2xl">
              BN
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tighter">BETNOVA</div>
              <div className="text-[10px] text-emerald-500 -mt-1">GHANA SPORTS</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search matches, teams or leagues..."
              className="w-full bg-gray-900 border border-gray-700 rounded-full pl-11 py-3 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Balance */}
            <div className="hidden md:flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-2xl border border-gray-700">
              <Wallet className="text-emerald-500" size={20} />
              <span className="font-semibold text-sm">
                {currency} {walletBalance.toLocaleString()}
              </span>
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all">
              Deposit
            </button>

            <button className="p-3 hover:bg-gray-800 rounded-xl">
              <Bell size={22} />
            </button>

            <button className="p-3 hover:bg-gray-800 rounded-xl">
              <User size={22} />
            </button>

            <button 
              className="md:hidden p-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
