
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  MINING_REWARD = 'MINING_REWARD',
  TRADE_WIN = 'TRADE_WIN',
  TRADE_LOSS = 'TRADE_LOSS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  GCOIN_SALE = 'GCOIN_SALE'
}

export type AccountType = 'DEMO' | 'REAL';

export interface Asset {
  symbol: string;
  name: string;
  binancePair: string;
  color: string;
}

export const SUPPORTED_ASSETS: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', binancePair: 'BTCUSDT', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', binancePair: 'ETHUSDT', color: '#627EEA' },
  { symbol: 'SOL', name: 'Solana', binancePair: 'SOLUSDT', color: '#14F195' },
  { symbol: 'BNB', name: 'Binance Coin', binancePair: 'BNBUSDT', color: '#F3BA2F' },
  { symbol: 'XRP', name: 'Ripple', binancePair: 'XRPUSDT', color: '#23292F' },
  { symbol: 'ADA', name: 'Cardano', binancePair: 'ADAUSDT', color: '#0033AD' },
  { symbol: 'DOGE', name: 'Dogecoin', binancePair: 'DOGEUSDT', color: '#C2A633' }
];

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'USD' | 'GCOIN';
  accountType: AccountType;
  date: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface UserState {
  activeAccount: AccountType;
  balanceUSD_Demo: number;
  balanceUSD_Real: number;
  balanceGCoin_Demo: number;
  balanceGCoin_Real: number;
  mobileNumber?: string;
  isMiningSubscribed: boolean;
  transactions: Transaction[];
  developerFunds: number;
  // Profile identification fields
  name?: string;
  email?: string;
  isVerified: boolean;
}

export interface MarketData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum Country {
  KENYA = 'Kenya',
  GHANA = 'Ghana',
  NIGERIA = 'Nigeria',
  SOUTH_AF_RICA = 'South Africa',
  UGANDA = 'Uganda',
  TANZANIA = 'Tanzania',
  RWANDA = 'Rwanda',
  USA = 'United States',
  UK = 'United Kingdom',
  UAE = 'UAE',
  INDIA = 'India',
  OTHER = 'Other'
}
