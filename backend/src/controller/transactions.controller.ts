import { Request, Response } from 'express';
import { getWalletTransactions } from '../service/walletTransactions.service';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wallet } = req.params;
        
        if (!wallet) {
            res.status(400).json({ error: 'Wallet parameter is required' });
            return;
        }

        const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(wallet);
        if (!isValidAddress) {
            res.status(400).json({ error: 'Invalid wallet address format. Must be a valid Ethereum address' });
            return;
        }

        const transactions = await getWalletTransactions(wallet);
        
        res.status(200).json({
            success: true,
            wallet: wallet,
            transactions: transactions
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};