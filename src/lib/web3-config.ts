import { createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism, base],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID || '' }),
    publicProvider(),
  ]
)

// Setup connectors
const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      metadata: {
        name: 'Blockchain Chat',
        description: 'Decentralized chat application with Web3 features',
        url: 'https://blockchain-chat.app',
        icons: ['https://blockchain-chat.app/icon.png'],
      },
    },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Blockchain Chat',
      appLogoUrl: 'https://blockchain-chat.app/icon.png',
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
]

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }

// Chat contract addresses for different chains
export const CHAT_CONTRACTS = {
  [mainnet.id]: '0x1234567890123456789012345678901234567890',
  [polygon.id]: '0x2345678901234567890123456789012345678901',
  [arbitrum.id]: '0x3456789012345678901234567890123456789012',
  [optimism.id]: '0x4567890123456789012345678901234567890123',
  [base.id]: '0x5678901234567890123456789012345678901234',
}

// Token contract addresses for gated access
export const TOKEN_CONTRACTS = {
  [mainnet.id]: {
    governance: '0x6789012345678901234567890123456789012345',
    access: '0x7890123456789012345678901234567890123456',
  },
  [polygon.id]: {
    governance: '0x8901234567890123456789012345678901234567',
    access: '0x9012345678901234567890123456789012345678',
  },
}