'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDynamicContext, Wallet, useUserWallets } from '@dynamic-labs/sdk-react-core';

interface WalletContextType {
    isConnected: boolean;
    connectedWallets: Wallet[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { primaryWallet } = useDynamicContext();
    const userWallets = useUserWallets();
    const [isConnected, setIsConnected] = useState(false);
    const [connectedWallets, setConnectedWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        setConnectedWallets(userWallets);
    }, [primaryWallet]);

    useEffect(() => {
        setIsConnected(!!primaryWallet?.address);
    }, [primaryWallet]);

    return (
        <WalletContext.Provider value={{ isConnected, connectedWallets }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
