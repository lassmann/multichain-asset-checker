/* c8 ignore start */
'use client';

import { ComponentProps, PropsWithChildren, useContext } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';
import { http } from 'viem';
import { mainnet } from 'viem/chains';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';

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
