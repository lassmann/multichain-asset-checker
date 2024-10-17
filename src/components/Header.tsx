'use client';

import ConnectWalletButton from './ConnectWalletButton';

const Header = () => {
    return (
        <header className="bg-blue-500 p-4">
            <nav className="container mx-auto flex justify-end items-center">
                <ConnectWalletButton />
            </nav>
        </header>
    );
};

export default Header;
