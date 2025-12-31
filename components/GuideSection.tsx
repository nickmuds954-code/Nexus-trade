
import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  Cpu, 
  Wallet, 
  ShieldCheck, 
  Smartphone,
  DollarSign,
  ArrowRightCircle,
  Zap,
  Layout,
  Code2
} from 'lucide-react';

const GuideSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<number | null>(0);

  const topics = [
    {
      title: "Platform Overview",
      icon: <Layout className="text-blue-500" size={24} />,
      content: "NexusTrade Pro is an all-in-one financial ecosystem. You can trade global assets using USD or our native G-Coin. The platform features two main account types: Demo (for practice with $10,000) and Real (for actual market gains)."
    },
    {
      title: "Mastering the Terminal",
      icon: <TrendingUp className="text-green-500" size={24} />,
      content: "Use the toggles in the top-left of the chart to switch between Professional Candlesticks, Line/Area charts, or OHLC Bars. Monitor the 'AI Signal' at the top for real-time market grounding powered by Gemini. To trade: set your amount, choose Buy (Up) or Sale (Down), and wait 3 seconds for settlement."
    },
    {
      title: "G-Coin Mining Ecosystem",
      icon: <Cpu className="text-yellow-500" size={24} />,
      content: "G-Coins are exclusive digital assets that can be used for trading or exchanged for USD. To mine, you must subscribe for $1.00 from your Real Balance. Once subscribed, use the 'Mining' section to generate coins. Remember to click 'COLLECT' to move them to your wallet."
    },
    {
      title: "Deposits & Local Settlements",
      icon: <Wallet className="text-purple-500" size={24} />,
      content: "We support localized Mobile Money across Kenya, Ghana, Nigeria, and more. To start: go to Wallet -> Deposit, select your country, enter your number, and authorize. Withdrawals are processed back to your chosen provider within minutes."
    },
    {
      title: "Exchanging G-Coins for USD",
      icon: <DollarSign className="text-emerald-500" size={24} />,
      content: "If you have mined G-Coins and want to cash out, go to Wallet -> Exchange. Sell your G-Coins at the current fixed rate (1 G = $0.85 USD). The funds will move instantly to your USD balance for withdrawal."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
          <BookOpen className="text-yellow-500" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Nexus Academy</h1>
          <p className="text-gray-500 font-medium">Master the Terminal & Maximize Your Liquidity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topic List */}
        <div className="lg:col-span-1 space-y-3">
          {topics.map((topic, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveTopic(idx)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${activeTopic === idx ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5' : 'bg-[#181a20] border-[#2b3139] hover:border-gray-600'}`}
            >
              <div className="shrink-0">{topic.icon}</div>
              <span className={`text-xs font-black uppercase tracking-widest ${activeTopic === idx ? 'text-white' : 'text-gray-400'}`}>
                {topic.title}
              </span>
              <ChevronRight size={16} className={`ml-auto ${activeTopic === idx ? 'text-yellow-500' : 'text-gray-700'}`} />
            </button>
          ))}

          <div className="mt-8 p-6 bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/20 rounded-3xl">
             <ShieldCheck className="text-green-500 mb-3" size={20} />
             <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Legitimacy Badge</h4>
             <p className="text-[9px] text-gray-500 leading-relaxed">All transactions are secured by 256-bit SSL encryption and verifiable on the localized provider ledgers.</p>
          </div>
        </div>

        {/* Content Display */}
        <div className="lg:col-span-2 space-y-6">
          {activeTopic !== null ? (
            <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  {topics[activeTopic].icon}
                </div>
                <h2 className="text-2xl font-black text-white">{topics[activeTopic].title}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-loose font-medium mb-8">
                {topics[activeTopic].content}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/20 rounded-xl border border-[#2b3139]">
                  <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1 block">Pro Tip</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-bold italic">Check AI signals before entering high-volatility trades.</p>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-[#2b3139]">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 block">Safety</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-bold italic">Withdraw mined profits to Mobile Money daily for best liquidity.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#181a20] rounded-3xl border border-[#2b3139] p-8 flex flex-col items-center justify-center text-center opacity-50 h-full">
               <Zap className="text-gray-700 mb-4" size={48} />
               <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Select a topic to reveal the terminal manual</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-8 flex items-center justify-between group cursor-pointer transition-transform hover:scale-[1.01]">
            <div>
              <h3 className="text-black text-xl font-black mb-1">Ready to start?</h3>
              <p className="text-black/70 text-xs font-bold uppercase tracking-widest">Deploy $10,000 in Demo Now</p>
            </div>
            <ArrowRightCircle size={40} className="text-black group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-[#2b3139] flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-8">
            <Feature icon={<ShieldCheck size={14}/>} label="Legit Platform" />
            <Feature icon={<Smartphone size={14}/>} label="Local Payments" />
            <Feature icon={<Code2 size={14}/>} label="Dev Verified" />
         </div>
         <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Revision ID: ACAD-001-2024</p>
      </div>
    </div>
  );
};

const Feature: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
    {icon}
    {label}
  </div>
);

export default GuideSection;
