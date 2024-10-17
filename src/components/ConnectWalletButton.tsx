'use client';

import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";

const ConnectWalletButton = () => {
    const handleConnectWallet = () => {
        console.log("User clicked Connect Wallet button");
    };

    return (
        <button
            className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
            onClick={handleConnectWallet}
        >
            <DynamicConnectButton>
                Connect Wallet
            </DynamicConnectButton>
        </button>
    );
};

export default ConnectWalletButton;
