'use client';

import React, { useEffect } from 'react';
import { useWallet } from '../../WalletContext';
import { getTokenBalances } from '../../../services/covalentService';
import { Chain } from '@covalenthq/client-sdk';

const Profile: React.FC = () => {
    const { isConnected, connectedWallets, dynamicUser } = useWallet();

    if (!isConnected) {
        return <div>Please connect your wallet to view your profile.</div>;
    }

    // useEffect(() => {
    //     async function fetchTokenBalances() {
          
    //         const chainName: Chain = 'arbitrum-mainnet';
    //         const walletAddress = '0xdEE6B1A01329f737020547c30ED35228E78A0cf2';
          
    //         try {
    //           const response = await getTokenBalances(chainName, walletAddress);
    //           console.log('Token balances:', response);
    //         } catch (error) {
    //           console.error('Error fetching token balances:', error);
    //         }
    //       }
    //       console.log("calling")
    //       fetchTokenBalances();
    // }, [])

    return (
        <div>
            <h1>Your Wallet Profile</h1>
            Userid: {dynamicUser?.userId}
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
