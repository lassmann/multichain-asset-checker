import { Chain, GoldRushClient } from "@covalenthq/client-sdk";
import { ENV } from '@/constants';
const client = new GoldRushClient(ENV.GOLDRUSH_ID);

import { debounce } from 'lodash';

const debouncedGetTokenBalances = debounce(
  async (chain: Chain, walletAddress: string) => {
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
  },
  333,
  { leading: false, trailing: true, maxWait: 333 }
);

export const getTokenBalances = async (chain: Chain, walletAddress: string) => {
  return debouncedGetTokenBalances(chain, walletAddress);
};
