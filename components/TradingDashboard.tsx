
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
/* Removed non-existent Defs and LinearGradient imports as Recharts uses native SVG tags for these. */
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  Line,
  Area,
  ComposedChart,
  ReferenceLine,
  Label
} from 'recharts';
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Signal,
  Sparkles,
  BarChart3,
  ExternalLink,
  Activity,
  Maximize2,
  Layout,
  BookOpen
} from 'lucide-react';
import { UserState, MarketData, SUPPORTED_ASSETS, Asset } from '../types';
import { getGeminiMarketAnalysis } from '../services/geminiService';

interface TradingDashboardProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}

interface TradeResult {
  isWin: boolean;
  amount: number;
  asset: string;
  payout: number;
}

type ChartType = 'CANDLE' | 'LINE' | 'BAR';

// Custom OHLC Bar Component
const OHLCBar = (props: any) => {
  const { x, y, width, height, open, close, high, low } = props;
  const isBullish = close >= open;
  const color = isBullish ? '#22c55e' : '#ef4444';
  
  const ratio = height / Math.abs(open - close);
  const wickTop = y - (high - Math.max(open, close)) * ratio;
  const wickBottom = y + height + (Math.min(open, close) - low) * ratio;

  return (
    <g>
      {/* Vertical Range Line */}
      <line x1={x + width / 2} y1={wickTop} x2={x + width / 2} y2={wickBottom} stroke={color} strokeWidth={1.5} />
      {/* Open Tick (Left) */}
      <line x1={x} y1={y + (close >= open ? height : 0)} x2={x + width / 2} y2={y + (close >= open ? height : 0)} stroke={color} strokeWidth={1.5} />
      {/* Close Tick (Right) */}
      <line x1={x + width / 2} y1={y + (close >= open ? 0 : height)} x2={x + width} y2={y + (close >= open ? 0 : height)} stroke={color} strokeWidth={1.5} />
    </g>
  );
};

// Custom Candlestick Component
const Candlestick = (props: any) => {
  const { x, y, width, height, open, close, high, low } = props;
  const isBullish = close >= open;
  const color = isBullish ? '#22c55e' : '#ef4444';
  
  const ratio = height / Math.abs(open - close);
  const wickTop = y - (high - Math.max(open, close)) * ratio;
  const wickBottom = y + height + (Math.min(open, close) - low) * ratio;

  return (
    <g>
      <line x1={x + width / 2} y1={wickTop} x2={x + width / 2} y2={wickBottom} stroke={color} strokeWidth={1} />
      <rect x={x} y={y} width={width} height={Math.max(height, 1)} fill={color} />
    </g>
  );
};

const TradingDashboard: React.FC<TradingDashboardProps> = ({ user, setUser }) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(SUPPORTED_ASSETS[0]);
  const [data, setData] = useState<MarketData[]>([]);
  const [tradeAmount, setTradeAmount] = useState(10);
  const [currencyType, setCurrencyType] = useState<'USD' | 'GCOIN'>('USD');
  const [isTrading, setIsTrading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ text: string, sources: any[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState({ high: 0, low: 0, change: 0, vol: 0 });
  const [showAssetList, setShowAssetList] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('CANDLE');
  
  const [lastResult, setLastResult] = useState<TradeResult | null>(null);
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [currentSignal, setCurrentSignal] = useState<{ type: 'BUY' | 'SELL' | 'NEUTRAL', confidence: number }>({ type: 'NEUTRAL', confidence: 0 });

  const technicalLevels = useMemo(() => {
    if (data.length < 5) return { support: 0, resistance: 0 };
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    return {
      resistance: Math.max(...highs),
      support: Math.min(...lows)
    };
  }, [data]);

  useEffect(() => {
    const signalInterval = setInterval(() => {
      const types: ('BUY' | 'SELL' | 'NEUTRAL')[] = ['BUY', 'SELL', 'NEUTRAL'];
      setCurrentSignal({
        type: types[Math.floor(Math.random() * types.length)],
        confidence: Math.floor(Math.random() * 40) + 60
      });
    }, 8000);
    return () => clearInterval(signalInterval);
  }, []);

  const fetchRealPrice = useCallback(async (asset: Asset) => {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${asset.binancePair}`);
      const json = await res.json();
      setStats({
        high: parseFloat(json.highPrice),
        low: parseFloat(json.lowPrice),
        change: parseFloat(json.priceChangePercent),
        vol: parseFloat(json.volume)
      });
      return parseFloat(json.lastPrice);
    } catch (e) {
      return asset.symbol === 'BTC' ? 68000 : asset.symbol === 'ETH' ? 3500 : 145;
    }
  }, []);

  const generateCandle = (prevClose: number): MarketData => {
    const volatility = prevClose * 0.0005;
    const open = prevClose;
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.3);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.3);
    
    return {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      open,
      high,
      low,
      close,
      volume: Math.random() * 200
    };
  };

  useEffect(() => {
    const init = async () => {
      const startPrice = await fetchRealPrice(selectedAsset);
      let current = startPrice;
      const initialData: MarketData[] = [];
      for (let i = 0; i < 40; i++) {
        const candle = generateCandle(current);
        initialData.push({
            ...candle,
            time: new Date(Date.now() - (40 - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        current = candle.close;
      }
      setData(initialData);
    };

    init();

    const interval = setInterval(() => {
      setData(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const next = generateCandle(last.close);
        return [...prev.slice(1), next];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedAsset, fetchRealPrice]);

  const handleTrade = (type: 'UP' | 'DOWN') => {
    const isReal = user.activeAccount === 'REAL';
    const currentBalance = currencyType === 'USD' 
      ? (isReal ? user.balanceUSD_Real : user.balanceUSD_Demo)
      : (isReal ? user.balanceGCoin_Real : user.balanceGCoin_Demo);
    
    if (currentBalance < tradeAmount) {
      alert("Insufficient funds in " + user.activeAccount);
      return;
    }

    setIsTrading(true);
    setLastResult(null);
    const startPrice = data[data.length - 1].close;

    setTimeout(() => {
      const endPrice = data[data.length - 1].close;
      let isWin = type === 'UP' ? endPrice > startPrice : endPrice < startPrice;
      
      if (consecutiveLosses >= 4) {
        isWin = true; 
        setConsecutiveLosses(0);
      } else {
        if (!isWin) setConsecutiveLosses(prev => prev + 1);
        else setConsecutiveLosses(0);
      }

      const profit = isWin ? tradeAmount * 0.85 : -tradeAmount;

      setUser(prev => {
        const newState = { ...prev };
        if (currencyType === 'USD') {
          if (isReal) newState.balanceUSD_Real += profit;
          else newState.balanceUSD_Demo += profit;
        } else {
          if (isReal) newState.balanceGCoin_Real += profit;
          else newState.balanceGCoin_Demo += profit;
        }
        return newState;
      });

      setLastResult({
        isWin,
        amount: tradeAmount,
        asset: selectedAsset.symbol,
        payout: isWin ? tradeAmount * 1.85 : 0
      });
      setIsTrading(false);
    }, 3000);
  };

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await getGeminiMarketAnalysis(selectedAsset.name, data.map(d => d.close));
      setAiAnalysis(analysis);
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); }
  };

  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0;
  const isPositive = stats.change >= 0;
  const currentBalanceUSD = user.activeAccount === 'REAL' ? user.balanceUSD_Real : user.balanceUSD_Demo;

  return (
    <div className="flex flex-col h-full bg-[#0b0e11] overflow-hidden relative">
      {lastResult && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`p-10 rounded-3xl border-2 flex flex-col items-center gap-6 max-w-sm w-full mx-4 shadow-2xl transition-all scale-100 ${lastResult.isWin ? 'border-green-500 bg-green-500/20' : 'border-red-500 bg-red-500/20'}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${lastResult.isWin ? 'bg-green-500' : 'bg-red-500'}`}>
                {lastResult.isWin ? <CheckCircle2 size={56} className="text-black" /> : <XCircle size={56} className="text-black" />}
              </div>
              <div className="text-center">
                <h3 className={`text-3xl font-black uppercase tracking-widest mb-1 ${lastResult.isWin ? 'text-green-400' : 'text-red-400'}`}>
                  {lastResult.isWin ? 'PROFIT SETTLED' : 'TRADE CLOSED'}
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-tighter mb-4">Contract ID: {Math.random().toString(36).substr(2, 10).toUpperCase()}</p>
                <div className={`text-5xl font-black tabular-nums ${lastResult.isWin ? 'text-white' : 'text-red-400'}`}>
                  {lastResult.isWin ? `+$${(lastResult.amount * 0.85).toFixed(2)}` : `-$${lastResult.amount.toFixed(2)}`}
                </div>
              </div>
              <button onClick={() => setLastResult(null)} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all">
                RETURN TO TERMINAL
              </button>
           </div>
        </div>
      )}

      <div className="h-14 border-b border-[#1c2127] bg-[#181a20] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowAssetList(!showAssetList)} className="flex items-center gap-2 bg-[#1c2127] px-3 py-1.5 rounded-lg border border-[#2b3139] hover:border-yellow-500/50 transition-all">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ backgroundColor: selectedAsset.color }}>
                {selectedAsset.symbol[0]}
              </div>
              <span className="text-sm font-black">{selectedAsset.symbol}/USDT</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {showAssetList && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#181a20] border border-[#2b3139] rounded-xl shadow-2xl z-[60] overflow-hidden">
                {SUPPORTED_ASSETS.map(asset => (
                  <button key={asset.symbol} onClick={() => { setSelectedAsset(asset); setShowAssetList(false); setData([]); }} className="w-full flex items-center justify-between p-3 hover:bg-[#1c2127] transition-colors border-b border-[#2b3139] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ backgroundColor: asset.color }}>{asset.symbol[0]}</div>
                      <span className="text-xs font-bold">{asset.symbol}/USDT</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-6 border-l border-[#2b3139] pl-6">
            <StatItem label="Price" value={`$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color={isPositive ? 'text-green-500' : 'text-red-500'} />
            <StatItem label="Change" value={`${isPositive ? '+' : ''}${stats.change.toFixed(2)}%`} color={isPositive ? 'text-green-500' : 'text-red-500'} />
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Academy Shortcut */}
           <Link to="/academy" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 transition-all">
              <BookOpen size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Manual</span>
           </Link>

           <div className={`flex items-center gap-3 px-4 py-1.5 rounded-lg border transition-all duration-500 ${currentSignal.type === 'BUY' ? 'bg-green-500/10 border-green-500/30 text-green-500' : currentSignal.type === 'SELL' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-gray-500/10 border-gray-500/30 text-gray-500'}`}>
              <Signal size={14} className={currentSignal.type !== 'NEUTRAL' ? 'animate-pulse' : ''} />
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-black uppercase opacity-60 leading-none">AI Signal</span>
                <span className="text-[10px] font-black leading-none">{currentSignal.type} @ {currentSignal.confidence}%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-[#0b0e11] relative p-2">
            {/* Chart Type Toggle */}
            <div className="absolute top-4 left-4 z-20 flex bg-[#181a20]/80 p-1 rounded-xl border border-[#2b3139] backdrop-blur-sm">
              <button 
                onClick={() => setChartType('CANDLE')}
                className={`p-2 rounded-lg transition-all ${chartType === 'CANDLE' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                title="Candlestick View"
              >
                <Layout size={16} />
              </button>
              <button 
                onClick={() => setChartType('LINE')}
                className={`p-2 rounded-lg transition-all ${chartType === 'LINE' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                title="Line/Area View"
              >
                <Activity size={16} />
              </button>
              <button 
                onClick={() => setChartType('BAR')}
                className={`p-2 rounded-lg transition-all ${chartType === 'BAR' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                title="OHLC Bar View"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 10, fill: '#30363d'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '4px', fontSize: '10px' }}
                  itemStyle={{ color: '#eaecef' }}
                />
                
                <ReferenceLine y={technicalLevels.resistance} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1}>
                  <Label value="RESISTANCE" position="insideTopRight" fill="#ef4444" fontSize={9} fontWeight="bold" />
                </ReferenceLine>
                
                <ReferenceLine y={technicalLevels.support} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1}>
                  <Label value="SUPPORT" position="insideBottomRight" fill="#22c55e" fontSize={9} fontWeight="bold" />
                </ReferenceLine>

                {chartType === 'LINE' && (
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#eab308" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    animationDuration={300}
                  />
                )}

                {chartType === 'CANDLE' && (
                  <Bar 
                    dataKey="close" 
                    shape={(props: any) => {
                      const { open, close, high, low } = data[props.index];
                      return <Candlestick {...props} open={open} close={close} high={high} low={low} />;
                    }}
                  />
                )}

                {chartType === 'BAR' && (
                  <Bar 
                    dataKey="close" 
                    shape={(props: any) => {
                      const { open, close, high, low } = data[props.index];
                      return <OHLCBar {...props} open={open} close={close} high={high} low={low} />;
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>

            <div className="absolute top-4 right-4 bg-[#181a20]/80 px-3 py-1.5 rounded-md border border-[#2b3139] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Market Grid Online</span>
            </div>
          </div>

          <div className="h-48 bg-[#181a20] border-t border-[#1c2127] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-yellow-500">
                <BarChart3 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">NexTrade Core Intelligence</span>
              </div>
              <button onClick={runAiAnalysis} disabled={isAnalyzing} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded-md text-[9px] font-black uppercase">
                {isAnalyzing ? 'Decoding Market...' : 'Run Terminal Scan'}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-xs text-gray-400 leading-relaxed font-medium whitespace-pre-wrap text-left">
                {aiAnalysis?.text || `Monitoring volatility boundaries. Resistance: $${technicalLevels.resistance.toFixed(2)} | Support: $${technicalLevels.support.toFixed(2)}. Terminal view optimized for ${chartType.toLowerCase()} analysis.`}
              </p>
              {aiAnalysis?.sources && aiAnalysis.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#2b3139]">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest w-full mb-1 text-left">Grounding Sources:</span>
                  {aiAnalysis.sources.map((source: any, idx: number) => (
                    source.web && (
                      <a 
                        key={idx} 
                        href={source.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1.5 text-[9px] bg-[#1c2127] text-gray-400 border border-[#2b3139] px-2 py-1 rounded hover:text-yellow-500 hover:border-yellow-500/30 transition-all"
                      >
                        <ExternalLink size={10} />
                        {source.web.title || 'Market Link'}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-80 border-l border-[#1c2127] bg-[#181a20] flex flex-col">
          <div className="p-4 border-b border-[#1c2127]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Trend Consensus</span>
              <span className="text-yellow-500 animate-pulse"><Sparkles size={12} /></span>
            </div>
            <div className="w-full bg-[#2b3139] h-1.5 rounded-full overflow-hidden flex">
               <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: '65%' }} />
               <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: '35%' }} />
            </div>
            <div className="flex justify-between mt-1.5">
               <span className="text-[8px] font-black text-green-500 uppercase">BULLS 65%</span>
               <span className="text-[8px] font-black text-red-500 uppercase">BEARS 35%</span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Investment</span>
                <span className="text-[10px] text-yellow-500 font-bold uppercase">Bal: ${currentBalanceUSD.toFixed(0)}</span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={tradeAmount} 
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  className="w-full bg-[#1c2127] border border-[#2b3139] rounded-xl py-4 px-5 text-white font-black text-xl focus:outline-none focus:border-yellow-500" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 uppercase">USD</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-center justify-between text-[11px] font-black text-gray-500 bg-black/20 p-3 rounded-lg border border-[#2b3139]">
                <span className="uppercase">Settlement Ratio</span>
                <span className="text-green-500">85% PROFIT</span>
              </div>
              
              <button 
                onClick={() => handleTrade('UP')}
                disabled={isTrading}
                className="group w-full bg-green-500 hover:bg-green-600 text-black py-5 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-500/10 disabled:opacity-50"
              >
                {isTrading ? <Clock className="animate-spin" /> : <ArrowUp size={28} className="group-hover:-translate-y-1 transition-transform" />}
                BUY
              </button>
              
              <button 
                onClick={() => handleTrade('DOWN')}
                disabled={isTrading}
                className="group w-full bg-red-500 hover:bg-red-600 text-black py-5 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-red-500/10 disabled:opacity-50"
              >
                {isTrading ? <Clock className="animate-spin" /> : <ArrowDown size={28} className="group-hover:translate-y-1 transition-transform" />}
                SALE
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 10px; }
      `}} />
    </div>
  );
};

const StatItem: React.FC<{ label: string, value: string, color?: string }> = ({ label, value, color = 'text-gray-300' }) => (
  <div className="flex flex-col text-left">
    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">{label}</span>
    <span className={`text-xs font-black tabular-nums ${color}`}>{value}</span>
  </div>
);

export default TradingDashboard;
