import { MetaMaskSDK } from '@metamask/sdk';
import { ChainInfo, AVAILABLE_CHAINS } from '../contexts/WalletContext';

let sdkInstance: MetaMaskSDK | null = null;

export const initializeMetaMaskSDK = (): MetaMaskSDK => {
  if (!sdkInstance) {
    sdkInstance = new MetaMaskSDK({
      dappMetadata: {
        name: 'NeeO Dashboard',
        url: window.location.href,
        iconUrl: `${window.location.origin}/favicon.ico`,
      },
      infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY || '3a2992d0aebf4ec5a6b11c76cac36b88',
      logging: {
        developerMode: import.meta.env.DEV,
      },
      checkInstallationImmediately: false,
      preferDesktop: true,
      extensionOnly: false,
    });
  }
  return sdkInstance;
};

export const getMetaMaskSDK = (): MetaMaskSDK | null => {
  return sdkInstance;
};

export const connectToMetaMask = async (): Promise<string[]> => {
  const sdk = initializeMetaMaskSDK();
  
  try {
    await sdk.init();
    
    const accounts = await sdk.connect();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
    return accounts;
  } catch (error) {
    console.error('MetaMask SDK connection failed:', error);
    
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found in fallback');
        }
        
        return accounts;
      } catch (fallbackError) {
        console.error('Fallback connection also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw new Error('MetaMask is not available');
  }
};

export const getConnectedAccounts = async (): Promise<string[]> => {
  const sdk = getMetaMaskSDK();
  
  if (sdk && sdk.getProvider()) {
    try {
      const accounts = await sdk.getProvider()?.request({
        method: 'eth_accounts',
      }) as string[];
      
      return accounts || [];
    } catch (error) {
      console.error('Error getting connected accounts:', error);
    }
  }
  
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      }) as string[];
      
      return accounts || [];
    } catch (error) {
      console.error('Error getting accounts from fallback:', error);
    }
  }
  
  return [];
};

export const getCurrentChain = async (): Promise<string> => {
  const provider = getMetaMaskSDK()?.getProvider();
  
  if (provider) {
    try {
      const chainId = await provider.request({
        method: 'eth_chainId',
      }) as string;
      
      return chainId;
    } catch (error) {
      console.error('Error getting current chain:', error);
    }
  }
  
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      }) as string;
      
      return chainId;
    } catch (error) {
      console.error('Error getting chain from fallback:', error);
    }
  }
  
  return '0x1';
};

export const switchChain = async (chainId: string): Promise<void> => {
  const provider = getMetaMaskSDK()?.getProvider();
  
  if (provider || window.ethereum) {
    const targetProvider = provider || window.ethereum;
    
    if (!targetProvider) {
      throw new Error('No provider available');
    }
    
    try {
      await targetProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        const chainInfo = AVAILABLE_CHAINS.find(chain => chain.chainId === chainId);
        if (chainInfo) {
          await addChainToWallet(chainInfo);
          await targetProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          });
        } else {
          throw new Error(`Chain ${chainId} not found in available chains`);
        }
      } else {
        throw error;
      }
    }
  } else {
    throw new Error('MetaMask is not available');
  }
};

export const addChainToWallet = async (chainInfo: ChainInfo): Promise<void> => {
  const provider = getMetaMaskSDK()?.getProvider();
  
  if (provider || window.ethereum) {
    const targetProvider = provider || window.ethereum;
    
    if (!targetProvider) {
      throw new Error('No provider available');
    }
    
    try {
      await targetProvider.request({
        method: 'wallet_addEthereumChain',
        params: [chainInfo],
      });
    } catch (error) {
      console.error('Error adding chain to wallet:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask is not available');
  }
};

export const switchAccount = async (accountAddress: string): Promise<void> => {
  const provider = getMetaMaskSDK()?.getProvider();
  
  if (provider || window.ethereum) {
    const targetProvider = provider || window.ethereum;
    
    if (!targetProvider) {
      throw new Error('No provider available');
    }
    
    try {
      await targetProvider.request({
        method: 'eth_requestAccounts',
      });
      
      const accounts = await targetProvider.request({
        method: 'eth_accounts',
      }) as string[];
      
      if (!accounts.includes(accountAddress.toLowerCase())) {
        throw new Error(`Account ${accountAddress} is not connected`);
      }
      
    } catch (error) {
      console.error('Error switching account:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask is not available');
  }
};

export const disconnectFromMetaMask = async (): Promise<void> => {
  const sdk = getMetaMaskSDK();
  
  if (sdk) {
    try {
      await sdk.terminate();
      sdkInstance = null;
    } catch (error) {
      console.error('Error disconnecting from MetaMask:', error);
    }
  }
};

export const setupMetaMaskEventListeners = (callbacks: {
  onAccountsChanged?: (accounts: string[]) => void;
  onChainChanged?: (chainId: string) => void;
  onConnect?: (connectInfo: { chainId: string }) => void;
  onDisconnect?: (error: { code: number; message: string }) => void;
}) => {
  const provider = getMetaMaskSDK()?.getProvider();
  
  if (provider || window.ethereum) {
    const targetProvider = provider || window.ethereum;
    
    if (!targetProvider) {
      return () => {};
    }
    
    if (callbacks.onAccountsChanged) {
      targetProvider.on('accountsChanged', callbacks.onAccountsChanged);
    }
    
    if (callbacks.onChainChanged) {
      targetProvider.on('chainChanged', callbacks.onChainChanged);
    }
    
    if (callbacks.onConnect) {
      targetProvider.on('connect', callbacks.onConnect);
    }
    
    if (callbacks.onDisconnect) {
      targetProvider.on('disconnect', callbacks.onDisconnect);
    }
    
    return () => {
      try {
        if (callbacks.onAccountsChanged && 'off' in targetProvider) {
          (targetProvider as any).off('accountsChanged', callbacks.onAccountsChanged);
        }
        if (callbacks.onChainChanged && 'off' in targetProvider) {
          (targetProvider as any).off('chainChanged', callbacks.onChainChanged);
        }
        if (callbacks.onConnect && 'off' in targetProvider) {
          (targetProvider as any).off('connect', callbacks.onConnect);
        }
        if (callbacks.onDisconnect && 'off' in targetProvider) {
          (targetProvider as any).off('disconnect', callbacks.onDisconnect);
        }
      } catch (error) {
        console.error('Error removing event listeners:', error);
      }
    };
  }
  
  return () => {};
};

export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const getCurrentNetworkInfo = async (): Promise<ChainInfo | null> => {
  try {
    const chainId = await getCurrentChain();
    return AVAILABLE_CHAINS.find(chain => chain.chainId === chainId) || null;
  } catch (error) {
    console.error('Error getting current network info:', error);
    return null;
  }
};
