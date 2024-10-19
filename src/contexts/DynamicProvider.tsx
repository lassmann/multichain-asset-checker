/* c8 ignore start */
'use client';

import { ComponentProps, PropsWithChildren } from 'react';
import { DynamicContextProvider, FilterChain } from '@dynamic-labs/sdk-react-core'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import {
  BitcoinIcon,
  EthereumIcon,
  FlowIcon,
  SolanaIcon,
} from '@dynamic-labs/iconic';
import { ENV } from '@/constants';

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: { [mainnet.id]: http() }
});

const queryClient = new QueryClient();

const settings: ComponentProps<typeof DynamicContextProvider>['settings'] = {
  environmentId: ENV.DYNAMIC_ENV_ID,
  walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
  events: {
    onWalletAdded: () => {},
    onWalletRemoved: () => {},
    onLogout: () => {},
    onAuthSuccess: () => {}
  },
  overrides: {
    views: [
      {
        type: 'wallet-list',
        tabs: {
          items: [
            {
              label: { text: 'All chains' },
            },
            {
              label: { icon: <EthereumIcon /> },
              walletsFilter: FilterChain('EVM'),
              recommendedWallets: [
                {
                  walletKey: 'metamask',
                },
              ],
            },
            {
              label: { icon: <SolanaIcon /> },
              walletsFilter: FilterChain('SOL'),
              recommendedWallets: [
                {
                  walletKey: 'phantom',
                },
              ],
            }
          ]
        }
      }
    ]
  }

};

export const DynamicProvider = ({ children }: PropsWithChildren) => {

  return (
    <DynamicContextProvider settings={settings} >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
