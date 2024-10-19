import { BalanceItem, Chain, GoldRushClient } from "@covalenthq/client-sdk";
import { ENV } from '@/constants';
const client = new GoldRushClient(ENV.GOLDRUSH_ID);
import { debounce } from 'lodash';

const fetchBalance = async (chain: Chain, walletAddress: string): Promise<BalanceItem[]> => {
  try {
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
      chain,
      walletAddress,
      { quoteCurrency: "USD" }
    );

    return resp.data?.items?.map(a => ({ ...a, balance: null, balance_24h: null })) ?? [];
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
}

const debouncedFetchBalance = debounce(async (chain: Chain, walletAddress: string, callback: Function) => {
  const balances = await fetchBalance(chain, walletAddress);
  callback(balances);
}, 200);

export const getTokenBalances = async (chain: Chain, walletAddress: string): Promise<BalanceItem[]> => {
  return new Promise((resolve) => {
    debouncedFetchBalance(chain, walletAddress, resolve);
  });
};
