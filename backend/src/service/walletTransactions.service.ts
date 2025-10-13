import { BlockchainUtils } from '../utils/blockchain';
import { getNetworkByName } from '../config/networks.config';

export const getWalletTransactions = async (wallet: string, network: string, fromBlock?: number, toBlock?: number): Promise<any[]> => {
    try {
        const networkConfig = getNetworkByName(network);
        
        if (!networkConfig) {
            throw new Error('No valid network configuration found');
        }
        
        const networkUrl = networkConfig.url;
        const transactions = await BlockchainUtils.fetchTransactionsFromBlockchain(wallet, networkUrl, fromBlock, toBlock);
        return transactions;
    } catch (error) {
        console.error("Error fetching wallet transactions:", error);
        throw error;
    }
};