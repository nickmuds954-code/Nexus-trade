
import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Sparkles, TrendingUp, Pickaxe, Smartphone } from 'lucide-react';
import { UserState } from '../types';

interface MiningSectionProps {
  user: UserState;
  onSubscribe: (mobile: string) => boolean;
  onMine: (amount: number) => void;
}

const MiningSection: React.FC<MiningSectionProps> = ({ user, onSubscribe, onMine }) => {
  const [isMining, setIsMining] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [mobileForMining, setMobileForMining] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isMining) {
      interval = setInterval(() => {
        const gain = 0.005 + (Math.random() * 0.002);
        setAccumulated(prev => prev + gain);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isMining]);

  const handleCollect = () => {
    onMine(accumulated);
    setAccumulated(0);
    setIsMining(false);
  };

  const handleSubSubmit = () => {
    if (!mobileForMining || mobileForMining.length < 9) {
      alert("Please enter a valid mobile number for top-up.");
      return;
    }
    const success = onSubscribe(mobileForMining);
    if (!success) {
      alert("Insufficient REAL account balance. Please top up your Real Account with $1.00 first.");
    }
  };

  if (!user.isMiningSubscribed) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-gradient-to-br from-[#1e2329] to-[#0b0e11] rounded-3xl p-8 border border-yellow-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu size={200} className="text-yellow-500" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/30">
              <Cpu className="text-yellow-500" size={40} />
            </div>
            
            <h1 className="text-4xl font-black mb-4">Real Account <span className="text-yellow-500">Mining</span></h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              Mine tradeable G-Coins using our cloud farm. Subscription requires a one-time $1 payment from your Real Balance.
            </p>

            <div className="bg-[#1e2329] p-8 rounded-2xl w-full max-w-md border border-[#2b3139] mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase text-left mb-2">Mobile Number for Top-up</label>
              <div className="relative mb-4">
                <input 
                  type="text" 
                  value={mobileForMining}
                  onChange={(e) => setMobileForMining(e.target.value)}
                  placeholder="e.g. 0700 000 000"
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-10 text-white focus:outline-none focus:border-yellow-500 font-bold"
                />
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-400">Subscription Fee</span>
                <span className="text-lg font-black text-green-500">$1.00 USD</span>
              </div>
              <button 
                onClick={handleSubSubmit}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-yellow-500/20"
              >
                PAY & START MINING
              </button>
              <p className="text-[10px] text-gray-500 mt-4 italic">Funds will be deducted from your Real Account balance.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl font-black mb-2">Mining Hub <span className="text-xs text-green-500 align-middle ml-2 uppercase tracking-widest px-2 py-0.5 bg-green-500/10 rounded">Real Mode</span></h2>
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Status: Connected to Node {user.mobileNumber?.slice(-4)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Mined Balance (Real)</div>
            <div className="text-2xl font-black text-yellow-500">{user.balanceGCoin_Real.toFixed(2)} G</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-10 relative">
          <div className="text-center relative z-10">
            <div className="text-6xl font-black mb-4 tracking-tighter tabular-nums text-white">
              {accumulated.toFixed(4)} <span className="text-2xl text-gray-500 font-normal">G</span>
            </div>
            <div className="flex gap-4">
              {!isMining ? (
                <button onClick={() => setIsMining(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-4 rounded-2xl font-black text-xl flex items-center gap-3 transition-all">
                  <Pickaxe /> START
                </button>
              ) : (
                <button onClick={handleCollect} className="bg-green-500 hover:bg-green-600 text-black px-12 py-4 rounded-2xl font-black text-xl flex items-center gap-3 transition-all">
                  <Zap /> COLLECT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningSection;
