
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Smartphone, 
  Globe, 
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Info,
  Filter,
  Calendar,
  XCircle,
  TrendingUp,
  TrendingDown,
  Cpu,
  CreditCard,
  History as HistoryIcon,
  CheckCircle2,
  AlertCircle,
  CreditCard as CardIcon,
  Search,
  RefreshCw,
  ArrowRightLeft
} from 'lucide-react';
import { UserState, TransactionType, Country } from '../types';

interface WalletSectionProps {
  user: UserState;
  addTransaction: (type: TransactionType, amount: number, currency: 'USD' | 'GCOIN', forceAccount?: 'DEMO' | 'REAL') => void;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  exchangeGCoin: (gAmount: number, usdGain: number) => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({ user, addTransaction, setUser, exchangeGCoin }) => {
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'EXCHANGE' | 'HISTORY'>('DEPOSIT');
  const [country, setCountry] = useState<Country>(Country.KENYA);
  const [amount, setAmount] = useState(10);
  const [withdrawAmount, setWithdrawAmount] = useState(10);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || '');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Exchange State
  const [gAmountToSell, setGAmountToSell] = useState(0);
  const G_RATE = 0.85; // 1 G-Coin = 0.85 USD

  // Filter States
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const activeUSD = user.activeAccount === 'REAL' ? user.balanceUSD_Real : user.balanceUSD_Demo;
  const activeGCoin = user.activeAccount === 'REAL' ? user.balanceGCoin_Real : user.balanceGCoin_Demo;

  const handleDeposit = () => {
    if (amount <= 0) return;
    if (user.activeAccount === 'REAL' && (!mobileNumber || mobileNumber.length < 9)) {
      setStatus({ type: 'error', message: "Real Account deposits require a valid Mobile Money number or Wallet ID." });
      return;
    }

    if (user.activeAccount === 'REAL') {
      setUser(p => ({ ...p, mobileNumber: mobileNumber }));
    }

    addTransaction(TransactionType.DEPOSIT, amount, 'USD');
    setStatus({ type: 'success', message: `Successfully deposited $${amount} to your ${user.activeAccount} account.` });
    
    setTimeout(() => setStatus(null), 3000);
  };

  const handleWithdraw = () => {
    if (withdrawAmount < 5) {
      setStatus({ type: 'error', message: "Minimum withdrawal amount is $5.00" });
      return;
    }
    if (withdrawAmount > activeUSD) {
      setStatus({ type: 'error', message: "Insufficient funds for this withdrawal." });
      return;
    }
    if (!mobileNumber || mobileNumber.length < 9) {
      setStatus({ type: 'error', message: "Please enter a valid mobile number or account for receiving funds." });
      return;
    }

    addTransaction(TransactionType.WITHDRAW, -withdrawAmount, 'USD');
    setStatus({ type: 'success', message: `Withdrawal request for $${withdrawAmount} submitted to ${mobileNumber}. Settlement in progress.` });
    
    setTimeout(() => setStatus(null), 3000);
  };

  const handleExchange = () => {
    if (gAmountToSell <= 0) return;
    if (gAmountToSell > activeGCoin) {
      setStatus({ type: 'error', message: "Insufficient G-Coin balance." });
      return;
    }

    const usdGain = gAmountToSell * G_RATE;
    exchangeGCoin(gAmountToSell, usdGain);
    setStatus({ type: 'success', message: `Exchange complete. Sold ${gAmountToSell} G-Coins for $${usdGain.toFixed(2)} USD.` });
    setGAmountToSell(0);
    setTimeout(() => setStatus(null), 3000);
  };

  const filteredTransactions = useMemo(() => {
    return user.transactions.filter(tx => {
      const matchAccount = tx.accountType === user.activeAccount;
      const matchType = typeFilter === 'ALL' || tx.type === typeFilter;
      
      let matchDate = true;
      if (startDate || endDate) {
        const txDate = new Date(tx.date).setHours(0, 0, 0, 0);
        if (startDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          if (txDate < start) matchDate = false;
        }
        if (endDate) {
          const end = new Date(endDate).setHours(23, 59, 59, 999);
          if (txDate > end) matchDate = false;
        }
      }

      return matchAccount && matchType && matchDate;
    });
  }, [user.transactions, user.activeAccount, typeFilter, startDate, endDate]);

  const getIconForType = (type: TransactionType, amount: number) => {
    switch (type) {
      case TransactionType.TRADE_WIN: return <TrendingUp size={16} className="text-green-500" />;
      case TransactionType.TRADE_LOSS: return <TrendingDown size={16} className="text-red-500" />;
      case TransactionType.MINING_REWARD: return <Cpu size={16} className="text-yellow-500" />;
      case TransactionType.SUBSCRIPTION: return <CreditCard size={16} className="text-purple-500" />;
      case TransactionType.GCOIN_SALE: return <ArrowRightLeft size={16} className="text-yellow-500" />;
      default: return amount > 0 ? <ArrowDownLeft size={16} className="text-green-500" /> : <ArrowUpRight size={16} className="text-red-500" />;
    }
  };

  const resetFilters = () => {
    setTypeFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  const isMobileMoneyRegion = (c: Country) => [Country.KENYA, Country.GHANA, Country.NIGERIA, Country.UGANDA, Country.TANZANIA, Country.RWANDA].includes(c);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {status && (
        <div className={`fixed bottom-8 right-8 z-[100] p-4 rounded-xl shadow-2xl flex items-center gap-3 border animate-in slide-in-from-right duration-300 ${status.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' : 'bg-red-500/90 border-red-400 text-white'}`}>
          {status.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
          <span className="font-bold text-sm">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className={`p-6 rounded-3xl text-black shadow-xl transition-all ${user.activeAccount === 'REAL' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-yellow-500 to-yellow-600'}`}>
            <h3 className="font-bold opacity-70 mb-1 tracking-tighter uppercase text-[10px]">{user.activeAccount} Liquidity</h3>
            <div className="text-4xl font-black mb-6 tabular-nums">${activeUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            
            <div className="bg-black/10 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">G-Coin Reserve</span>
                <span className="font-black text-lg">{activeGCoin.toFixed(2)} G</span>
              </div>
            </div>
          </div>

          <div className="bg-[#181a20] rounded-2xl border border-[#2b3139] overflow-hidden p-4">
             <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Terminal</span>
             </div>
             <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
               Funds in your <span className="text-white font-bold">{user.activeAccount}</span> account are ready for instant market deployment or withdrawal to localized providers.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#181a20] rounded-3xl border border-[#2b3139] flex flex-col overflow-hidden">
          <div className="flex border-b border-[#1c2127]">
            {['DEPOSIT', 'WITHDRAW', 'EXCHANGE', 'HISTORY'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-4 font-black text-[10px] uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1">
            {activeTab === 'DEPOSIT' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Global Region Selector</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(Country).map(c => (
                      <button 
                        key={c} 
                        onClick={() => setCountry(c)} 
                        className={`py-2 px-3 rounded-lg border text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all ${country === c ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-[#2b3139] text-gray-500 hover:border-gray-600'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-black/20 rounded-xl border border-[#2b3139] flex items-center gap-4">
                  {isMobileMoneyRegion(country) ? <Smartphone size={24} className="text-yellow-500" /> : <CardIcon size={24} className="text-blue-500" />}
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">
                      {isMobileMoneyRegion(country) ? 'Mobile Money Gateway' : 'Bank & Card Gateway'}
                    </p>
                    <p className="text-[9px] text-gray-500">Secure 256-bit encrypted transaction for {country}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">
                    {isMobileMoneyRegion(country) ? 'Recipient Phone Number' : 'Account Identifier / Card No'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={mobileNumber} 
                      onChange={(e) => setMobileNumber(e.target.value)} 
                      placeholder={isMobileMoneyRegion(country) ? "e.g. +254 700 000 000" : "Enter account or card identification"}
                      className="w-full bg-[#1e2329] border border-[#2b3139] rounded-xl py-4 px-12 font-black text-white focus:outline-none focus:border-yellow-500 transition-all text-sm" 
                    />
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Amount (USD)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(Number(e.target.value))} 
                      className="w-full bg-[#1e2329] border border-[#2b3139] rounded-xl py-4 px-12 text-3xl font-black text-white focus:outline-none focus:border-yellow-500" 
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
                  </div>
                </div>

                <button onClick={handleDeposit} className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-black py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-widest">
                  AUTHORIZE DEPOSIT
                </button>
              </div>
            )}

            {activeTab === 'WITHDRAW' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-2xl flex items-start gap-4">
                   <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                   <div>
                      <p className="text-[10px] font-black text-green-500 uppercase mb-1">Seamless Global Settlement</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">NexusTrade ensures liquidity is delivered to your {country} account within minutes. Multi-country support enabled.</p>
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Destination ({country})</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={mobileNumber} 
                      onChange={(e) => setMobileNumber(e.target.value)} 
                      placeholder="Enter receiving account / mobile no"
                      className="w-full bg-[#1e2329] border border-[#2b3139] rounded-xl py-4 px-12 font-black text-white focus:outline-none focus:border-yellow-500 transition-all text-sm" 
                    />
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Settlement Amount</label>
                  <div className="relative mb-4">
                    <input 
                      type="number" 
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))} 
                      className="w-full bg-[#1e2329] border border-[#2b3139] rounded-xl py-4 px-12 text-3xl font-black text-white focus:outline-none focus:border-yellow-500" 
                    />
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 100, 500, 1000].map(val => (
                      <button 
                        key={val} 
                        onClick={() => setWithdrawAmount(val)}
                        className="py-2 bg-[#1c2127] hover:bg-[#2b3139] rounded-lg text-[10px] font-black text-gray-500 border border-[#2b3139] transition-all"
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleWithdraw} 
                  className="w-full bg-white hover:bg-gray-200 active:scale-[0.98] text-black py-5 rounded-2xl font-black text-sm transition-all shadow-xl uppercase tracking-widest"
                >
                  SETTLE TO {country.toUpperCase()}
                </button>
              </div>
            )}

            {activeTab === 'EXCHANGE' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-3xl text-center">
                  <RefreshCw size={40} className="mx-auto text-yellow-500 mb-4 animate-spin-slow" />
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">G-Coin Liquidity Hub</h3>
                  <p className="text-xs text-gray-400 font-medium px-4">Convert your mined assets into tradeable USD instantly. Fixed settlement rate applies.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/20 p-4 rounded-2xl border border-[#2b3139]">
                      <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Exchange Rate</span>
                      <span className="text-lg font-black text-white">1 G = ${G_RATE} USD</span>
                   </div>
                   <div className="bg-black/20 p-4 rounded-2xl border border-[#2b3139]">
                      <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Available Reserve</span>
                      <span className="text-lg font-black text-yellow-500">{activeGCoin.toFixed(2)} G</span>
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest">Sell G-Coin Amount</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={gAmountToSell} 
                      onChange={(e) => setGAmountToSell(Number(e.target.value))} 
                      className="w-full bg-[#1e2329] border border-[#2b3139] rounded-xl py-4 px-12 text-3xl font-black text-white focus:outline-none focus:border-yellow-500" 
                    />
                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={24} />
                    <button 
                      onClick={() => setGAmountToSell(activeGCoin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-yellow-500 uppercase hover:text-white transition-colors"
                    >
                      SELL MAX
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 py-4">
                   <div className="h-px bg-[#2b3139] flex-1"></div>
                   <ArrowRightLeft className="text-gray-600 rotate-90" size={20} />
                   <div className="h-px bg-[#2b3139] flex-1"></div>
                </div>

                <div className="bg-black/40 p-6 rounded-3xl border border-[#2b3139] flex justify-between items-center">
                   <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">You Receive</span>
                      <span className="text-3xl font-black text-green-500 tabular-nums">${(gAmountToSell * G_RATE).toFixed(2)}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Currency</span>
                      <span className="text-lg font-black text-white">USD</span>
                   </div>
                </div>

                <button 
                  onClick={handleExchange}
                  disabled={gAmountToSell <= 0 || gAmountToSell > activeGCoin}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 active:scale-[0.98] text-black py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-widest"
                >
                  EXECUTE LIQUIDATION
                </button>
              </div>
            )}

            {activeTab === 'HISTORY' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-[#1e2329] p-5 rounded-3xl border border-[#2b3139] space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 opacity-60">
                    <Filter size={14} />
                    Audit Log Filters
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Event Category</span>
                      <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl px-4 py-2.5 text-[10px] text-white font-black focus:outline-none focus:border-yellow-500 appearance-none uppercase"
                      >
                        <option value="ALL">All Events</option>
                        {Object.values(TransactionType).map(type => (
                          <option key={type} value={type}>{type.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">From</span>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl px-4 py-2 text-[10px] text-white font-black focus:outline-none focus:border-yellow-500 block"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">To</span>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl px-4 py-2 text-[10px] text-white font-black focus:outline-none focus:border-yellow-500 block"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={resetFilters}
                      className="text-[9px] font-black text-yellow-500 hover:text-yellow-400 flex items-center gap-1.5 uppercase tracking-widest"
                    >
                      <XCircle size={12} />
                      CLEAR LOG FILTERS
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(tx => (
                      <div key={tx.id} className="bg-[#1e2329] p-4 rounded-2xl flex items-center justify-between border border-[#2b3139] hover:bg-[#2b3139]/30 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-[#2b3139] group-hover:border-yellow-500/30 transition-colors">
                            {getIconForType(tx.type, tx.amount)}
                          </div>
                          <div>
                            <div className="font-black text-[10px] flex items-center gap-2 uppercase tracking-tighter">
                              {tx.type.replace('_', ' ')}
                              {tx.currency === 'GCOIN' && <span className="text-[7px] bg-yellow-500/10 text-yellow-500 px-1 py-0.5 rounded font-black tracking-widest border border-yellow-500/20">G</span>}
                            </div>
                            <div className="text-[9px] text-gray-500 font-bold">{new Date(tx.date).toLocaleDateString()} · {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-black tabular-nums ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.currency}
                          </div>
                          <div className="text-[7px] text-gray-600 font-black uppercase tracking-widest mt-0.5 opacity-50">{tx.id.slice(0, 10)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-[#1e2329]/30 rounded-3xl border border-dashed border-[#2b3139]">
                      <HistoryIcon size={32} className="mx-auto text-gray-700 mb-4 opacity-30" />
                      <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Log Empty</p>
                      <p className="text-gray-600 text-[9px] mt-2 font-medium">No recorded movements for the current parameters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 10px;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default WalletSection;
