import { Chain, GoldRushClient } from "@covalenthq/client-sdk";
import { ENV } from '@/constants';
const client = new GoldRushClient(ENV.GOLDRUSH_ID);

export const getTokenBalances = async (chain: Chain, walletAddress: string) => {
  try {
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
      chain,
      walletAddress,
      { quoteCurrency: "USD" }
    );
    return resp.data;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
};

