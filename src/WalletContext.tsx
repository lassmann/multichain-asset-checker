'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDynamicContext, Wallet, useUserWallets, UserProfile } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';

interface WalletContextType {
    isConnected: boolean;
    connectedWallets: Wallet[];
    dynamicUser?: UserProfile;
    connect: () => void;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { primaryWallet, user } = useDynamicContext();
    const userWallets = useUserWallets();
    const [isConnected, setIsConnected] = useState(false);
    const [dynamicUser, setDynamicUser] = useState<UserProfile | undefined>();
    const [connectedWallets, setConnectedWallets] = useState<Wallet[]>([]);
    const router = useRouter();

    useEffect(() => {
        setConnectedWallets(userWallets);
        setDynamicUser(user);
    }, [primaryWallet, user]);

    useEffect(() => {
        setIsConnected(!!primaryWallet?.address);
    }, [primaryWallet]);

    const connect = () => {
        // Implement connect logic here
    };

    const disconnect = () => {
        setIsConnected(false);
        setConnectedWallets([]);
        router.push('/');
    };

    return (
        <WalletContext.Provider value={{ isConnected, connectedWallets, dynamicUser, connect, disconnect }}>
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
