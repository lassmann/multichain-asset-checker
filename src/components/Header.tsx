'use client';

import Link from 'next/link';
import ConnectWalletButton from './ConnectWalletButton';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useWallet } from '../WalletContext';

const Header = () => {
    const { handleLogOut } = useDynamicContext();
    const { isConnected } = useWallet();

    return (
        <header className="bg-blue-500 p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <div>
                    <Link href="/" className="text-white mr-4">Home</Link>
                    <Link href="/profile" className="text-white">Profile</Link>
                </div>
                <div>
                    {isConnected ? (
                        <button
                            onClick={() => handleLogOut()}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Disconnect
                        </button>
                    ) : (
                        <ConnectWalletButton />
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
