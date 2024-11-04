import { createContext, useMemo } from 'react';
import { ONCHAIN_KIT_CONFIG, setOnchainKitConfig } from './OnchainKitConfig';
import type { OnchainKitContextType, OnchainKitProviderReact } from './types';

export const OnchainKitContext =
  createContext<OnchainKitContextType>(ONCHAIN_KIT_CONFIG);

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  address,
  apiKey,
  chain,
  children,
  config,
  projectId,
  rpcUrl,
}: OnchainKitProviderReact) {
  const value = useMemo(() => {
    const defaultPaymasterUrl = apiKey
      ? `https://api.developer.coinbase.com/rpc/v1/${chain.name
          .replace(' ', '-')
          .toLowerCase()}/${apiKey}`
      : null;
    const onchainKitConfig = {
      address: address ?? null,
      apiKey: apiKey ?? null,
      chain: chain,
      config: {
        appearance: {
          name: config?.appearance?.name,
          logo: config?.appearance?.logo,
          mode: config?.appearance?.mode ?? 'auto',
          theme: config?.appearance?.theme ?? 'default',
        },
        paymaster: config?.paymaster || defaultPaymasterUrl,
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [address, apiKey, chain, config, projectId, rpcUrl]);

  return (
    <OnchainKitContext.Provider value={value}>
      {children}
    </OnchainKitContext.Provider>
  );
}
