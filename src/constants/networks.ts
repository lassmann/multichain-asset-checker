import { ChainName } from "@covalenthq/client-sdk";

export const NETWORKS = {
    SOL: [ChainName.SOLANA_MAINNET],
    EVM: [
        ChainName.ETH_MAINNET,
        ChainName.ARBITRUM_MAINNET,
        ChainName.BSC_MAINNET,
        ChainName.MATIC_MAINNET,
        ChainName.OPTIMISM_MAINNET,
        ChainName.BASE_MAINNET,
        ChainName.SCROLL_MAINNET,
    ],
};
