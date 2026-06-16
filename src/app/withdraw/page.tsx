"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Building2, CheckCircle } from "lucide-react";

export default function WithdrawPage() {
  const walletBalance = typeof window !== 'undefined' ? parseFloat(localStorage.getItem('betnova_wallet') || '1500') : 1500;
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0 || withdrawAmount > walletBalance) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newBalance = walletBalance - withdrawAmount;
      if (typeof window !== 'undefined') localStorage.setItem('betnova_wallet', newBalance.toString());
      setIsProcessing(false);
      setIsSuccess(true);
      setAmount("");
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Withdrawal Successful!</h2>
        <p className="text-gray-400 text-center mb-6">Your funds are on the way to your {method === 'momo' ? 'Mobile Money' : 'Bank Account'}.</p>
        <Link href="/" className="px-6 py-3 bg-green-500 text-gray-950 rounded-md font-bold hover:bg-green-600 transition-colors">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pb-24">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-md"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold">Withdraw Funds</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 text-center">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">GHS {walletBalance.toFixed(2)}</p>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Withdrawal Amount (GHS)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full h-12 rounded-lg border border-gray-800 bg-gray-950 px-4 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500" required />
            <div className="flex gap-2 mt-3">
              {[50, 100, 200, 500].map((amt) => (
                <button key={amt} type="button" onClick={() => setAmount(amt.toString())} className="flex-1 py-2 text-xs font-bold bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors">GHS {amt}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Withdrawal Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setMethod("momo")} className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${method === 'momo' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'}`}>
                <Smartphone className="w-5 h-5" /> Mobile Money
              </button>
              <button type="button" onClick={() => setMethod("bank")} className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${method === 'bank' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'}`}>
                <Building2 className="w-5 h-5" /> Bank Transfer
              </button>
            </div>
          </div>

          <button type="submit" disabled={isProcessing || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance} className="w-full h-12 bg-green-500 text-gray-950 rounded-lg font-bold text-base hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isProcessing ? "Processing..." : "Confirm Withdrawal"}
          </button>
        </form>
      </main>
    </div>
  );
}
