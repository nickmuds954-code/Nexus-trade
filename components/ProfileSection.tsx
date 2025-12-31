
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  Camera, 
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
  Settings,
  FileText
} from 'lucide-react';
import { UserState } from '../types';

interface ProfileSectionProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    mobile: user.mobileNumber || ''
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobile,
      isVerified: formData.name.length > 3 && formData.email.includes('@')
    }));
    setSaveStatus('Identity Updated Successfully');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center border-4 border-[#181a20] shadow-2xl overflow-hidden">
            {user.name ? (
              <span className="text-5xl font-black text-black">{user.name[0].toUpperCase()}</span>
            ) : (
              <User size={48} className="text-black" />
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-white mb-2">{user.name || 'New Trader Identity'}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${user.isVerified ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
              <ShieldCheck size={12} />
              {user.isVerified ? 'Account Verified' : 'Identity Unconfirmed'}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#181a20] border border-[#2b3139] text-gray-500">
              <Fingerprint size={12} />
              UID: NEX-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Settings className="text-yellow-500" size={20} />
              Identification Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Legal Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                    className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-10 text-white font-bold focus:outline-none focus:border-yellow-500"
                    placeholder="Enter your name"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">E-Mail Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                    className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-10 text-white font-bold focus:outline-none focus:border-yellow-500"
                    placeholder="trader@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Primary Mobile Money Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.mobile}
                    onChange={e => setFormData(p => ({...p, mobile: e.target.value}))}
                    className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-10 text-white font-bold focus:outline-none focus:border-yellow-500"
                    placeholder="e.g. 0700 000 000"
                  />
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-yellow-500/20"
            >
              SAVE IDENTIFICATION
            </button>

            {saveStatus && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-500 text-xs font-black uppercase">
                <CheckCircle2 size={14} />
                {saveStatus}
              </div>
            )}
          </form>

          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8">
            <h3 className="text-xl font-black text-white mb-6">Account History Log</h3>
            <div className="space-y-4">
              <HistoryItem label="Primary identity updated" time="Current Session" icon={<User size={14}/>} />
              <HistoryItem label="Real Account initialized" time="Account Start" icon={<ShieldCheck size={14}/>} />
              <HistoryItem label="Demo liquidity allocated" time="Initial Setup" icon={<Clock size={14}/>} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#1e2329] to-[#0b0e11] rounded-3xl p-6 border border-yellow-500/20">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Security Level</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500">KYC STATUS</span>
              <span className={`text-[10px] font-black ${user.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                {user.isVerified ? 'VERIFIED' : 'PENDING'}
              </span>
            </div>
            <div className="w-full h-1 bg-[#2b3139] rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${user.isVerified ? 'w-full bg-green-500' : 'w-1/3 bg-yellow-500'}`} />
            </div>
            <p className="text-[10px] text-gray-500 mt-4 leading-relaxed italic">
              Identification is required for localized Mobile Money withdrawals and High-Frequency Trading.
            </p>
          </div>

          <Link to="/privacy" className="block bg-[#181a20] border border-[#2b3139] rounded-3xl p-6 hover:bg-[#2b3139]/30 transition-all group">
             <div className="flex items-center gap-3 mb-2">
               <FileText className="text-blue-500 group-hover:scale-110 transition-transform" size={18} />
               <span className="text-xs font-black text-white uppercase tracking-widest">Privacy Protocol</span>
             </div>
             <p className="text-[10px] text-gray-500 leading-relaxed">View how NexusTrade Pro protects your identification data and financial transmissions.</p>
          </Link>

          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6">
             <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">Account Control</h4>
             <button className="w-full flex items-center justify-center gap-3 py-3 border border-red-500/20 rounded-xl text-red-500 font-black text-xs uppercase hover:bg-red-500/10 transition-colors">
               <LogOut size={16} />
               Terminal Logout
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryItem: React.FC<{ label: string, time: string, icon: React.ReactNode }> = ({ label, time, icon }) => (
  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-[#2b3139]">
    <div className="flex items-center gap-3">
      <div className="text-gray-600">{icon}</div>
      <span className="text-xs font-bold text-white">{label}</span>
    </div>
    <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{time}</span>
  </div>
);

export default ProfileSection;
