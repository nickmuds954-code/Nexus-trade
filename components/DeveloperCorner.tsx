
import React, { useState } from 'react';
import { ShieldAlert, Lock, ChevronRight, Phone, Landmark, ArrowRightCircle, Code2, Database } from 'lucide-react';
import { UserState } from '../types';

interface DeveloperCornerProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}

const DeveloperCorner: React.FC<DeveloperCornerProps> = ({ user, setUser }) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const correctPasscode = '2473651738';
  const developerNumber = '0706371846';

  const handleUnlock = () => {
    if (passcode === correctPasscode) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPasscode('');
    }
  };

  const handleWithdrawDevFunds = () => {
    if (user.developerFunds <= 0) {
      alert("No funds available in dev vault.");
      return;
    }
    
    alert(`Initiating transfer of $${user.developerFunds.toFixed(2)} to dev mobile no: ${developerNumber}`);
    
    setUser(prev => ({
      ...prev,
      developerFunds: 0
    }));
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#181a20] rounded-3xl border border-[#2b3139] shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2">Developer Vault</h2>
          <p className="text-sm text-gray-500 mb-8">Access restricted to authorized personnel only. Please enter the security credential.</p>
          
          <div className="w-full space-y-4">
            <input 
              type="password"
              placeholder="Enter Access Key"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`w-full bg-[#1e2329] border ${error ? 'border-red-500' : 'border-[#2b3139]'} rounded-xl py-4 px-6 text-center text-white text-xl tracking-widest focus:outline-none focus:border-yellow-500`}
            />
            {error && <p className="text-xs text-red-500 font-bold">Invalid credential. Access denied.</p>}
            
            <button 
              onClick={handleUnlock}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2"
            >
              UNLOCK VAULT
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
            <Code2 size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Core Developer Hub</h1>
        </div>
        <div className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-red-500/20">
          Admin Session Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8 space-y-8">
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase mb-2">Total Subscription Revenue</div>
            <div className="text-5xl font-black text-white">${user.developerFunds.toFixed(2)}</div>
            <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
              <Database size={12} />
              Vault Secured on Blockchain
            </div>
          </div>

          <div className="p-6 bg-black/20 rounded-2xl border border-[#2b3139] space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Phone size={18} />
              <div className="text-sm font-bold">Target Mobile: <span className="text-white">{developerNumber}</span></div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Landmark size={18} />
              <div className="text-sm font-bold">Method: <span className="text-white">Direct Settlement</span></div>
            </div>
          </div>

          <button 
            onClick={handleWithdrawDevFunds}
            className="w-full bg-green-500 hover:bg-green-600 text-black py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2"
          >
            DISBURSE FUNDS
            <ArrowRightCircle size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-yellow-500" />
              Security Logs
            </h3>
            <div className="space-y-3">
              <LogItem time="Just now" label="Admin access granted" status="AUTHORIZED" />
              <LogItem time="2 mins ago" label="Encryption key rotation" status="SUCCESS" />
              <LogItem time="1 hour ago" label="Subscription payload received" status="+$1.00" />
              <LogItem time="3 hours ago" label="Firewall health check" status="OPTIMAL" />
            </div>
          </div>
          
          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-6 text-center">
            <p className="text-xs text-gray-500">Platform operational since 2024. All movements are ledger-recorded.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogItem: React.FC<{ time: string, label: string, status: string }> = ({ time, label, status }) => (
  <div className="flex items-center justify-between text-[11px] border-b border-[#2b3139] pb-2 last:border-0 last:pb-0">
    <div className="flex flex-col">
      <span className="text-gray-400 font-bold uppercase tracking-tight">{label}</span>
      <span className="text-gray-600">{time}</span>
    </div>
    <span className="font-black text-gray-400">{status}</span>
  </div>
);

export default DeveloperCorner;
