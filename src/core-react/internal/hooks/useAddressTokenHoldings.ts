import type { TokenBalanceWithFiatValue } from '../../../wallet/components/island/WalletIslandTokenHoldings';

const tokenBalances: TokenBalanceWithFiatValue[] = [
  {
    token: {
      name: 'Ether',
      address: '',
      symbol: 'ETH',
      decimals: 18,
      image:
        'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 8453,
    },
    balance: 0.42,
    valueInFiat: 1386,
  },
  {
    token: {
      name: 'USD Coin',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
      symbol: 'USDC',
      decimals: 6,
      image:
        'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
      chainId: 8453,
    },
    balance: 69,
    valueInFiat: 69,
  },
];

export default function useAddressTokenHoldings() {
  return tokenBalances;
}
