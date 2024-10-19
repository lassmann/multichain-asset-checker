'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { getTokenBalances } from '@/services/covalentService';
import { BalanceItem, Chain } from '@covalenthq/client-sdk';
import { NETWORKS } from '@/constants';
import { ChainName } from "@covalenthq/client-sdk";
interface BalanceContextType {
    fetchAndStoreBalances: () => Promise<void>;
    balances: Record<string, any>;
    isLoading: boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
};

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isConnected, connectedWallets, dynamicUser } = useWallet();
    const [balances, setBalances] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchAndStoreBalances = async () => {
        if (!dynamicUser?.userId) return;
        setIsLoading(true);
        try {
            const userData = JSON.parse(localStorage.getItem(dynamicUser.userId) || '{}');
            userData["addresses"] = userData["addresses"] || {};
            const timestamp = new Date().toISOString();
            userData.timestamp = timestamp;

            for (let wallet of connectedWallets) {
                const { chain, address } = wallet;
                const addressData = userData.addresses[address] || {};

                if (chain === 'SOL') {
                    try {
                        const solanaBalance: BalanceItem[] = await getTokenBalances(ChainName.SOLANA_MAINNET, address);

                        const filteredSolanaBalance = solanaBalance.filter((asset) => {
                            const balance = asset.pretty_quote ? parseFloat(asset.pretty_quote.replace('$', '')) : 0;
                            return balance > 0;
                        });

                        const notionalBalance = filteredSolanaBalance.reduce((acc: number, curr: BalanceItem) => {
                            const balance = curr.pretty_quote ? parseFloat(curr.pretty_quote.replace('$', '')) : 0;
                            return acc + balance;
                        }, 0);

                        addressData[ChainName.SOLANA_MAINNET.toUpperCase()] = {
                            balance: notionalBalance,
                            assetList: filteredSolanaBalance,
                        };

                    } catch (error) {
                        console.error('Error fetching Solana balances:', error);
                    }
                } else if (chain === 'EVM') {
                    const evmChains = NETWORKS.EVM;
                    for (let evmChain of evmChains) {
                        try {
                            const evmBalance = await getTokenBalances(evmChain as Chain, address);

                            const filteredEvmBalance = evmBalance.filter((asset) => {
                                const balance = asset.pretty_quote ? parseFloat(asset.pretty_quote.replace('$', '')) : 0;
                                return balance > 0;
                            });

                            const notionalBalance = filteredEvmBalance.reduce((acc: number, curr: BalanceItem) => {
                                const balance = curr.pretty_quote ? parseFloat(curr.pretty_quote.replace('$', '')) : 0;
                                return acc + balance;
                            }, 0);

                            addressData[evmChain.toUpperCase()] = {
                                balance: notionalBalance,
                                assetList: filteredEvmBalance,
                            };

                        } catch (error) {
                            console.error(`Error fetching EVM balances for ${evmChain}:`, error);
                        }
                    }
                }

                userData.addresses[address] = addressData;
            }

            localStorage.setItem(dynamicUser.userId, JSON.stringify(userData));
            setBalances(userData.addresses);
            console.log(`Balances stored in localStorage for user ${dynamicUser.userId}:`, userData);
        } catch (error) {
            console.error('Error fetching balances:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected && connectedWallets.length > 0 && dynamicUser?.userId) {
            const localItem = localStorage.getItem(dynamicUser.userId);
            if (localItem) {
                const userData = JSON.parse(localItem);
                const storedWalletCount = Object.keys(userData.addresses || {}).length;
                
                if (storedWalletCount !== connectedWallets.length) {
                    // Remove localStorage item and fetch balances again
                    localStorage.removeItem(dynamicUser.userId);
                    fetchAndStoreBalances();
                } else {
                    setBalances(userData.addresses);
                }
            } else {
                fetchAndStoreBalances();
            }
        }
    }, [isConnected, connectedWallets, dynamicUser]);

    return (
        <BalanceContext.Provider value={{ fetchAndStoreBalances, balances, isLoading }}>
            {children}
        </BalanceContext.Provider>
    );
};
