'use client'

import { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/web3-config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  )
}