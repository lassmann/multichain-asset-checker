'use client';

import React from 'react';
import { useWallet } from '../../WalletContext';

const Profile: React.FC = () => {
    const { isConnected, connectedWallets } = useWallet();

    if (!isConnected) {
        return <div>Please connect your wallet to view your profile.</div>;
    }

    return (
        <div>
            <h1>Your Wallet Profile</h1>
            {connectedWallets.map((wallet, index) => (
                <div key={index}>
                    <h2>Wallet {index + 1}</h2>
                    <p>Address: {wallet.address}</p>
                    <p>Chain: {wallet.chain}</p>
                </div>
            ))}
        </div>
    );
};

export default Profile;
