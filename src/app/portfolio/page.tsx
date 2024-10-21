'use client';

import React, { useEffect, useRef } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useBalance } from '../../contexts/BalanceContext';
import { useState } from 'react';


const sumAndSortAssets = (data: any) => {
    const assetSums: any = {};
    const assetDetails: any = {};

    for (const address in data) {
        const networks = data[address];
        for (const network in networks) {
            const assetList = networks[network].assetList || [];
            assetList.forEach((asset: any) => {
                const ticker = asset.contract_ticker_symbol;

                if (assetSums[ticker]) {
                    assetSums[ticker] += asset.quote;
                } else {
                    assetSums[ticker] = asset.quote;
                }

                if (!assetDetails[ticker]) {
                    assetDetails[ticker] = [];
                }
                assetDetails[ticker].push({
                    network,
                    address,
                    balance: asset.quote,
                    chain: network,
                    wallet: address,
                    tokenCount: asset.balance,
                    pricePerToken: asset.quote_rate,
                });
            });
        }
    }

    const sortedAssets = Object.entries(assetSums)
        .map(([ticker, total]) => ({ ticker, total }))
        .sort((a: any, b: any) => b.total - a.total);

    return { sortedAssets, assetDetails };
}


const Profile: React.FC = () => {
    const { isConnected, connectedWallets } = useWallet();
    const { balances, isLoading } = useBalance();
    const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
    const [openOptionsIndex, setOpenOptionsIndex] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpenOptionsIndex(null);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenOptionsIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionsToggle = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setOpenOptionsIndex(openOptionsIndex === index ? null : index);
    };

    const handleOptionClick = (option: string, detail: any) => {
        console.log(`Selected ${option} for:`, detail);
        setOpenOptionsIndex(null);
    };

    if (!isConnected) {
        return <div>Please connect your wallet to view your profile.</div>;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-xl font-semibold text-gray-200">Loading your balances...</p>
            </div>
        );
    }

    const { sortedAssets, assetDetails } = sumAndSortAssets(balances);
    const totalValue = sortedAssets.reduce((sum: number, asset: any) => sum + asset.total, 0);
    return (
        <div className="flex justify-center">
            <div className="text-center max-w-2xl w-full pt-8">
                <>
                    <h1 className="text-2xl font-bold mb-4">Your Wallet Profile</h1>
                    <h2>Asset Allocation:</h2>
                    {sortedAssets.map((asset: any) => {
                        const percentage = (asset.total / totalValue) * 100;
                        const isExpanded = expandedAsset === asset.ticker;

                        return (
                            <div key={asset.ticker} className="mb-2">
                                <div
                                    className="relative z-10 flex justify-between mb-1 p-2 cursor-pointer hover:bg-gray-700 transition-all duration-300 ease-out rounded"
                                    onClick={() => setExpandedAsset(isExpanded ? null : asset.ticker)}
                                >
                                    <span>{asset.ticker}</span>
                                    <span>${asset.total.toFixed(2)} ({percentage.toFixed(2)}%)</span>
                                </div>
                                <div className="relative z-10 w-full bg-gray-700 rounded-full h-2.5 mx-2">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                {isExpanded && (
                                    <div className="mt-2 p-2 bg-gray-800 rounded">
                                        {assetDetails[asset.ticker]
                                            .sort((a: any, b: any) => b.balance - a.balance)
                                            .map((detail: any, index: number) => (
                                                <div key={index} className="mt-2 p-2 bg-gray-700 rounded text-left flex justify-between items-center">
                                                    <div>
                                                        <p>Chain: {detail.chain.split('-')[0]}</p>
                                                        <p>Wallet: {`${detail.wallet.slice(0, 4)}...${detail.wallet.slice(-4)}`}</p>
                                                        <p>Balance: ${detail.balance.toFixed(2)}</p>
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            ref={buttonRef}
                                                            className="text-white focus:outline-none"
                                                            onClick={(e) => handleOptionsToggle(index, e)}
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                                            </svg>
                                                        </button>
                                                        {openOptionsIndex === index && (
                                                            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                                                <div className="py-1">
                                                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleOptionClick('Swap', detail)}>Swap</button>
                                                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleOptionClick('Bridge', detail)}>Bridge</button>
                                                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleOptionClick('Stake', detail)}>Stake</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </>
            </div>
        </div>
    );
};

export default Profile;
