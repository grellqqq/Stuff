'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName, useBalance } from 'wagmi'
import { Button } from '@/components/ui/button'
import { cn, truncateAddress, formatBalance } from '@/lib/utils'
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react'

export function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected, connector } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: balance } = useBalance({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <div className="relative">
        <Button
          variant="web3"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
          disabled={isLoading}
        >
          <Wallet className="h-4 w-4" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
          <ChevronDown className="h-4 w-4" />
        </Button>

        {isOpen && (
          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px] z-50">
            <h3 className="font-semibold mb-3 text-gray-900">Connect a Wallet</h3>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => {
                    connect({ connector })
                    setIsOpen(false)
                  }}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  disabled={!connector.ready || isLoading}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Wallet className="h-3 w-3 text-white" />
                  </div>
                  {connector.name}
                  {isLoading && connector.id === pendingConnector?.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
            {error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error.message}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 pr-2"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-600" />
        <span className="hidden sm:inline">
          {ensName || truncateAddress(address || '')}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px] z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Account</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  disconnect()
                  setIsOpen(false)
                }}
                className="gap-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-3 w-3" />
                Disconnect
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {truncateAddress(address || '', 6)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyAddress}
                    className="h-6 w-6"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openEtherscan}
                    className="h-6 w-6"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {balance && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className="font-mono text-sm">
                    {formatBalance(balance.value)} {balance.symbol}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Connected via</p>
                <p className="text-sm font-medium">{connector?.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}