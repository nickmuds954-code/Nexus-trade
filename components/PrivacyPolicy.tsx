
import React from 'react';
import { Shield, Lock, Eye, FileCheck, Globe, UserCheck, Smartphone, Info } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
          <Shield className="text-blue-500" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Privacy Protocol</h1>
          <p className="text-gray-500 font-medium">NexusTrade Pro Global Data Protection Standards</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Introduction */}
        <section className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            1. Overview
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            NexusTrade Pro ("Platform", "We", "Us") is committed to protecting the integrity of your identity and financial assets. 
            This Privacy Policy outlines the protocols we use to collect, secure, and manage data within our high-performance trading environment. 
            By accessing the terminal, you agree to the conditions stated herein.
          </p>
        </section>

        {/* Data Collection */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8 hover:border-blue-500/30 transition-all">
            <UserCheck className="text-blue-500 mb-4" size={24} />
            <h3 className="text-lg font-bold text-white mb-3">Identity Data</h3>
            <ul className="text-xs text-gray-500 space-y-3 font-bold uppercase tracking-tight">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                Legal Full Name for Settlement
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                Verified E-Mail Communication
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                Regional Mobile Money Credentials
              </li>
            </ul>
          </div>

          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8 hover:border-green-500/30 transition-all">
            <Smartphone className="text-green-500 mb-4" size={24} />
            <h3 className="text-lg font-bold text-white mb-3">Financial Transmission</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              We collect transaction history, including G-Coin mining rewards, trade execution logs, and withdrawal requests. 
              Mobile numbers used for $1.00 mining subscriptions are handled via encrypted gateways directly linked to our regional provider networks.
            </p>
          </div>
        </section>

        {/* AI & Third Parties */}
        <section className="bg-gradient-to-br from-[#181a20] to-[#0b0e11] rounded-3xl border border-[#2b3139] p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Globe size={150} className="text-blue-500" />
           </div>
           <div className="relative z-10">
             <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
               <Eye className="text-purple-500" size={20} />
               2. AI & Third-Party Disclosure
             </h2>
             <div className="space-y-4">
               <p className="text-sm text-gray-400 leading-relaxed font-medium">
                 NexusTrade Pro utilizes the <span className="text-white font-bold">Gemini AI Terminal</span> for real-time market grounding and analysis. 
                 When you request a "Terminal Scan", anonymized market data is processed to generate signals. No personal identity data is shared with the AI models.
               </p>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">
                 Financial data is shared exclusively with localized <span className="text-white font-bold">Mobile Money Operators</span> (e.g., in Kenya, Ghana, Nigeria) only to execute your requested deposits and withdrawals.
               </p>
             </div>
           </div>
        </section>

        {/* Security Protocols */}
        <section className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Lock className="text-red-500" size={20} />
            3. Security Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <SecurityFeature 
              title="256-Bit SSL" 
              desc="End-to-end encryption for all wallet transmissions." 
            />
            <SecurityFeature 
              title="Vault Access" 
              desc="Developer funds protected by 10-digit security credentials." 
            />
            <SecurityFeature 
              title="Identity Guard" 
              desc="Biometric-ready identification for high-value withdrawals." 
            />
          </div>
        </section>

        {/* Rights */}
        <section className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8">
           <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
             <FileCheck className="text-blue-400" size={20} />
             4. Your Rights
           </h2>
           <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
             You have the right to access your identification data, request corrections, or purge your account history from the live terminal. 
             Contact the Support Center at <span className="text-white font-bold">0706371846</span> for privacy-related requests.
           </p>
           <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
             <Globe size={12} />
             Compliant with Global Data Privacy Standards
           </div>
        </section>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em]">NexusTrade Pro · Security Revision 1.0.4 · 2024</p>
      </div>
    </div>
  );
};

const SecurityFeature: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="p-4 bg-black/20 rounded-2xl border border-[#2b3139]">
    <h4 className="text-xs font-black text-white uppercase mb-2 tracking-widest">{title}</h4>
    <p className="text-[10px] text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default PrivacyPolicy;
