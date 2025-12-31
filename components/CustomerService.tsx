
import React from 'react';
import { 
  Headset, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  // Added missing ChevronRight import
  ChevronRight
} from 'lucide-react';

const CustomerService: React.FC = () => {
  const supportPhone = '0706371846';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
          <Headset className="text-yellow-500" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Support Center</h1>
          <p className="text-gray-500 font-medium">NexusTrade Pro Global Assistance Terminal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Direct Contact Card */}
        <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Phone size={120} className="text-yellow-500" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Priority Voice Line</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Direct Tele-Assistance</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connect directly with our senior account managers for instant dispute resolution and market guidance.
            </p>
            
            <a 
              href={`tel:${supportPhone}`}
              className="inline-flex items-center gap-4 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-4 rounded-2xl font-black text-xl transition-all shadow-xl shadow-yellow-500/20 group"
            >
              <Phone size={24} className="group-hover:rotate-12 transition-transform" />
              {supportPhone}
            </a>
          </div>

          <div className="pt-6 border-t border-[#2b3139] flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-tighter">
            <Clock size={14} className="text-yellow-500/50" />
            Active Hours: 24/7 Global Rotation
          </div>
        </div>

        {/* Digital Channels */}
        <div className="space-y-6">
          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-6 hover:border-yellow-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Live Chat Hub</h4>
                <p className="text-[11px] text-gray-500 font-medium">Average response time: &lt; 2 minutes</p>
              </div>
              <ExternalLink size={16} className="text-gray-600" />
            </div>
          </div>

          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-6 hover:border-yellow-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 border border-purple-500/20">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Official Inquiry</h4>
                <p className="text-[11px] text-gray-500 font-medium">support@nexustrade-pro.io</p>
              </div>
              <ExternalLink size={16} className="text-gray-600" />
            </div>
          </div>

          <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-6">
             <div className="flex items-start gap-4">
                <ShieldCheck size={20} className="text-green-500 shrink-0" />
                <div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Secured Communications</h4>
                   <p className="text-[10px] text-gray-500 leading-relaxed font-medium">All support interactions are recorded on the secure ledger for your safety and compliance tracking.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <HelpCircle size={20} className="text-yellow-500" />
          Common Knowledge Base
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Withdrawal processing times",
            "G-Coin mining verification",
            "Real vs Demo execution",
            "Account safety protocols",
            "Mobile money provider status",
            "Trade signal interpretation"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-[#2b3139] hover:bg-black/40 transition-all group cursor-pointer">
               <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{item}</span>
               <ChevronRight size={14} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em]">NexusTrade Pro · Global Liquidity Network · Est 2024</p>
      </div>
    </div>
  );
};

export default CustomerService;
