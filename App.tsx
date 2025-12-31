
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  Cpu, 
  LayoutDashboard, 
  User,
  Code2,
  ChevronDown,
  ShieldCheck,
  Headset,
  FileText,
  BookOpen,
  Settings
} from 'lucide-react';
import TradingDashboard from './components/TradingDashboard';
import MiningSection from './components/MiningSection';
import WalletSection from './components/WalletSection';
import DeveloperCorner from './components/DeveloperCorner';
import CustomerService from './components/CustomerService';
import ProfileSection from './components/ProfileSection';
import PrivacyPolicy from './components/PrivacyPolicy';
import GuideSection from './components/GuideSection';
import { UserState, Transaction, TransactionType, AccountType } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserState>({
    activeAccount: 'DEMO',
    balanceUSD_Demo: 10000,
    balanceUSD_Real: 0,
    balanceGCoin_Demo: 0,
    balanceGCoin_Real: 0,
    isMiningSubscribed: false,
    transactions: [],
    developerFunds: 0,
    isVerified: false
  });

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const addTransaction = (type: TransactionType, amount: number, currency: 'USD' | 'GCOIN', forceAccount?: AccountType) => {
    const accType = forceAccount || user.activeAccount;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      currency,
      accountType: accType,
      date: Date.now(),
      status: 'COMPLETED'
    };
    
    setUser(prev => {
      const isUSD = currency === 'USD';
      const isReal = accType === 'REAL';
      
      return {
        ...prev,
        balanceUSD_Demo: (isUSD && !isReal) ? prev.balanceUSD_Demo + amount : prev.balanceUSD_Demo,
        balanceUSD_Real: (isUSD && isReal) ? prev.balanceUSD_Real + amount : prev.balanceUSD_Real,
        balanceGCoin_Demo: (!isUSD && !isReal) ? prev.balanceGCoin_Demo + amount : prev.balanceGCoin_Demo,
        balanceGCoin_Real: (!isUSD && isReal) ? prev.balanceGCoin_Real + amount : prev.balanceGCoin_Real,
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  const exchangeGCoin = (gAmount: number, usdGain: number) => {
    const accType = user.activeAccount;
    const isReal = accType === 'REAL';

    const gTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: TransactionType.GCOIN_SALE,
      amount: -gAmount,
      currency: 'GCOIN',
      accountType: accType,
      date: Date.now(),
      status: 'COMPLETED'
    };

    const usdTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: TransactionType.GCOIN_SALE,
      amount: usdGain,
      currency: 'USD',
      accountType: accType,
      date: Date.now(),
      status: 'COMPLETED'
    };

    setUser(prev => ({
      ...prev,
      balanceUSD_Demo: !isReal ? prev.balanceUSD_Demo + usdGain : prev.balanceUSD_Demo,
      balanceUSD_Real: isReal ? prev.balanceUSD_Real + usdGain : prev.balanceUSD_Real,
      balanceGCoin_Demo: !isReal ? prev.balanceGCoin_Demo - gAmount : prev.balanceGCoin_Demo,
      balanceGCoin_Real: isReal ? prev.balanceGCoin_Real - gAmount : prev.balanceGCoin_Real,
      transactions: [usdTx, gTx, ...prev.transactions]
    }));
  };

  const handleSubscribe = (mobile: string) => {
    if (user.balanceUSD_Real >= 1) {
      setUser(prev => ({
        ...prev,
        balanceUSD_Real: prev.balanceUSD_Real - 1,
        isMiningSubscribed: true,
        mobileNumber: mobile,
        developerFunds: prev.developerFunds + 1
      }));
      addTransaction(TransactionType.SUBSCRIPTION, -1, 'USD', 'REAL');
      return true;
    }
    return false;
  };

  const activeBalanceUSD = user.activeAccount === 'REAL' ? user.balanceUSD_Real : user.balanceUSD_Demo;
  const activeBalanceGCoin = user.activeAccount === 'REAL' ? user.balanceGCoin_Real : user.balanceGCoin_Demo;

  return (
    <Router>
      <div className="flex h-screen bg-[#0b0e11] text-[#eaecef] overflow-hidden">
        {/* Sidebar */}
        <nav className="w-16 md:w-64 bg-[#181a20] border-r border-[#2b3139] flex flex-col">
          <div className="p-4 flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <TrendingUp className="text-black w-6 h-6" />
            </div>
            <span className="hidden md:block font-bold text-xl tracking-tight text-white">NexusTrade</span>
          </div>

          <div className="flex-1 px-2 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Trading" />
            <NavItem to="/academy" icon={<BookOpen size={20} />} label="Academy" />
            <NavItem to="/mining" icon={<Cpu size={20} />} label="G-Coin Mining" />
            <NavItem to="/wallet" icon={<Wallet size={20} />} label="Wallet" />
            <NavItem to="/support" icon={<Headset size={20} />} label="Support" />
            <NavItem to="/profile" icon={<User size={20} />} label="Identity" />
            <NavItem to="/privacy" icon={<FileText size={20} />} label="Privacy" />
          </div>

          <div className="px-2 py-4 border-t border-[#2b3139]">
            <NavItem to="/dev-corner" icon={<Code2 size={20} />} label="Dev Hub" />
          </div>

          <div className="p-4 border-t border-[#2b3139] hidden md:block">
            <div className={`p-3 rounded-lg border ${user.activeAccount === 'REAL' ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">{user.activeAccount} USD</span>
                <span className={`text-sm font-semibold ${user.activeAccount === 'REAL' ? 'text-green-400' : 'text-yellow-400'}`}>
                  ${activeBalanceUSD.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400">{user.activeAccount} G-Coin</span>
                <span className="text-sm font-semibold text-white">{activeBalanceGCoin.toFixed(2)} G</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-[#2b3139] flex items-center justify-between px-6 bg-[#181a20] z-50">
            <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${user.activeAccount === 'REAL' ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'}`}
                >
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold">{user.activeAccount === 'REAL' ? 'Real Account' : 'Demo Account'}</span>
                  <ChevronDown size={14} />
                </button>
                
                {showAccountDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#1e2329] border border-[#2b3139] rounded-xl shadow-2xl overflow-hidden">
                    <button 
                      onClick={() => { setUser(p => ({...p, activeAccount: 'DEMO'})); setShowAccountDropdown(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-[#2b3139] transition-colors flex flex-col"
                    >
                      <span className="text-xs font-bold text-yellow-500">Demo Account</span>
                      <span className="text-[10px] text-gray-400">${user.balanceUSD_Demo.toFixed(2)}</span>
                    </button>
                    <button 
                      onClick={() => { setUser(p => ({...p, activeAccount: 'REAL'})); setShowAccountDropdown(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-[#2b3139] transition-colors flex flex-col border-t border-[#2b3139]"
                    >
                      <span className="text-xs font-bold text-green-500">Real Account</span>
                      <span className="text-[10px] text-gray-400">${user.balanceUSD_Real.toFixed(2)}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-black text-white">{user.name || 'Guest Trader'}</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{user.isVerified ? 'Identity Verified' : 'ID Pending'}</span>
              </div>
              <Link to="/wallet" className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded-md text-sm font-bold transition-all">
                Deposit
              </Link>
              <Link to="/profile" className="h-8 w-8 rounded-full bg-[#2b3139] flex items-center justify-center border border-gray-600 hover:border-yellow-500 transition-colors overflow-hidden">
                {user.name ? (
                  <span className="font-black text-xs text-yellow-500">{user.name[0].toUpperCase()}</span>
                ) : (
                  <User size={18} />
                )}
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-[#0b0e11] relative custom-scrollbar">
            <Routes>
              <Route path="/" element={<TradingDashboard user={user} setUser={setUser} />} />
              <Route path="/mining" element={<MiningSection user={user} onSubscribe={handleSubscribe} onMine={(amount) => addTransaction(TransactionType.MINING_REWARD, amount, 'GCOIN')} />} />
              <Route path="/wallet" element={<WalletSection user={user} addTransaction={addTransaction} setUser={setUser} exchangeGCoin={exchangeGCoin} />} />
              <Route path="/dev-corner" element={<DeveloperCorner user={user} setUser={setUser} />} />
              <Route path="/support" element={<CustomerService />} />
              <Route path="/profile" element={<ProfileSection user={user} setUser={setUser} />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/academy" element={<GuideSection />} />
            </Routes>
          </div>
        </main>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 10px; }
      `}} />
    </Router>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
        isActive ? 'bg-[#2b3139] text-white' : 'text-gray-400 hover:bg-[#2b3139]/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden md:block font-medium">{label}</span>
    </Link>
  );
};

export default App;
