export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  gasUsed?: string;
  gasPrice?: string;
  status?: 'success' | 'failed' | 'pending';
  network?: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface WalletInfo {
  address: string;
  network: string;
  balance?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface DashboardState {
  transactions: Transaction[];
  loading: LoadingState;
  error: ApiError | null;
  wallet: WalletInfo | null;
  total: number;
  hasMore: boolean;
}