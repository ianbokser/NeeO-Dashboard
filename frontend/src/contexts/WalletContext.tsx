import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { Transaction, ApiError } from '../types';

// Tipos para el contexto de wallet
export interface ChainInfo {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}

export interface WalletAccount {
  address: string;
  isActive: boolean;
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  currentAccount: string | null;
  accounts: WalletAccount[];
  currentChain: ChainInfo | null;
  availableChains: ChainInfo[];
  transactions: Transaction[];
  transactionsLoading: boolean;
  error: ApiError | string | null;
  sdk: any; // MetaMaskSDK instance
}

export type WalletAction =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CURRENT_ACCOUNT'; payload: string | null }
  | { type: 'SET_ACCOUNTS'; payload: WalletAccount[] }
  | { type: 'SET_CURRENT_CHAIN'; payload: ChainInfo | null }
  | { type: 'SET_AVAILABLE_CHAINS'; payload: ChainInfo[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_TRANSACTIONS_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ApiError | string | null }
  | { type: 'SET_SDK'; payload: any }
  | { type: 'RESET_WALLET' };

// Chains disponibles
export const AVAILABLE_CHAINS: ChainInfo[] = [
  {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  {
    chainId: '0xa4b1',
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
  {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
];

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  currentAccount: null,
  accounts: [],
  currentChain: AVAILABLE_CHAINS[0], // Default to Ethereum
  availableChains: AVAILABLE_CHAINS,
  transactions: [],
  transactionsLoading: false,
  error: null,
  sdk: null,
};

const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CURRENT_ACCOUNT':
      return { ...state, currentAccount: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_CURRENT_CHAIN':
      return { ...state, currentChain: action.payload };
    case 'SET_AVAILABLE_CHAINS':
      return { ...state, availableChains: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_TRANSACTIONS_LOADING':
      return { ...state, transactionsLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SDK':
      return { ...state, sdk: action.payload };
    case 'RESET_WALLET':
      return {
        ...initialState,
        availableChains: state.availableChains,
        sdk: state.sdk,
      };
    default:
      return state;
  }
};

export interface WalletContextType {
  state: WalletState;
  dispatch: (action: WalletAction) => void;
  // Helper functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  switchAccount: (accountAddress: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  addCustomChain: (chain: ChainInfo) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // Helper functions - estas serán sobrescritas por useWallet
  const connectWallet = async () => {
    console.log('Connect wallet - use useWallet hook instead');
  };

  const disconnectWallet = async () => {
    dispatch({ type: 'RESET_WALLET' });
  };

  const switchChain = async (chainId: string) => {
    const chain = state.availableChains.find(c => c.chainId === chainId);
    if (chain) {
      dispatch({ type: 'SET_CURRENT_CHAIN', payload: chain });
    }
  };

  const switchAccount = async (accountAddress: string) => {
    dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accountAddress });
  };

  const loadTransactions = async () => {
    console.log('Load transactions - use useWallet hook instead');
  };

  const addCustomChain = async (chain: ChainInfo) => {
    const updatedChains = [...state.availableChains, chain];
    dispatch({ type: 'SET_AVAILABLE_CHAINS', payload: updatedChains });
  };

  // Persist wallet state in localStorage
  useEffect(() => {
    if (state.currentAccount && state.currentChain) {
      localStorage.setItem('wallet-state', JSON.stringify({
        currentAccount: state.currentAccount,
        currentChain: state.currentChain,
        accounts: state.accounts,
      }));
    }
  }, [state.currentAccount, state.currentChain, state.accounts]);

  // Restore wallet state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('wallet-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.currentAccount) {
          dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: parsed.currentAccount });
        }
        if (parsed.currentChain) {
          dispatch({ type: 'SET_CURRENT_CHAIN', payload: parsed.currentChain });
        }
        if (parsed.accounts) {
          dispatch({ type: 'SET_ACCOUNTS', payload: parsed.accounts });
        }
      } catch (error) {
        console.error('Error restoring wallet state:', error);
      }
    }
  }, []);

  const contextValue: WalletContextType = {
    state,
    dispatch,
    connectWallet,
    disconnectWallet,
    switchChain,
    switchAccount,
    loadTransactions,
    addCustomChain,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;