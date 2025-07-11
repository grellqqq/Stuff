'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WalletConnect } from '@/components/wallet-connect'
import { cn, truncateAddress, formatTimestamp, generateMessageId } from '@/lib/utils'
import { Send, Hash, Lock, Crown, Users, Settings, Image, Zap } from 'lucide-react'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: number
  txHash?: string
  tokenGated?: boolean
  nftAvatar?: string
}

interface ChatRoom {
  id: string
  name: string
  description: string
  isTokenGated: boolean
  requiredToken?: string
  minTokenAmount?: string
  memberCount: number
  isPrivate: boolean
}

// Mock data for demonstration
const mockRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Open discussion for everyone',
    isTokenGated: false,
    memberCount: 1337,
    isPrivate: false,
  },
  {
    id: 'hodlers',
    name: 'Token Hodlers',
    description: 'Exclusive chat for token holders',
    isTokenGated: true,
    requiredToken: '0x1234...5678',
    minTokenAmount: '100',
    memberCount: 42,
    isPrivate: false,
  },
  {
    id: 'nft-club',
    name: 'NFT Collectors',
    description: 'For verified NFT owners only',
    isTokenGated: true,
    requiredToken: '0x5678...9012',
    minTokenAmount: '1',
    memberCount: 89,
    isPrivate: false,
  },
  {
    id: 'dao',
    name: 'DAO Governance',
    description: 'Governance discussions and proposals',
    isTokenGated: true,
    requiredToken: '0x9012...3456',
    minTokenAmount: '1000',
    memberCount: 156,
    isPrivate: true,
  },
]

const mockMessages: Message[] = [
  {
    id: '1',
    sender: '0x742d35Cc6634C0532925a3b8D5c4E21A8B0C9823',
    content: 'Welcome to the blockchain chat! 🚀',
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    nftAvatar: 'https://api.cryptopunks.app/cryptopunks/42.png'
  },
  {
    id: '2',
    sender: '0x8ba1f109551bD432803012645Hac136c9c8C3cQ',
    content: 'This is amazing! Love the Web3 integration',
    timestamp: Math.floor(Date.now() / 1000) - 1800,
  },
  {
    id: '3',
    sender: '0x742d35Cc6634C0532925a3b8D5c4E21A8B0C9823',
    content: 'Check out this proposal: https://snapshot.org/...',
    timestamp: Math.floor(Date.now() / 1000) - 900,
    tokenGated: true,
    nftAvatar: 'https://api.cryptopunks.app/cryptopunks/42.png'
  },
]

export function BlockchainChat() {
  const { address, isConnected } = useAccount()
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(mockRooms[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected || !address) return

    setIsLoading(true)
    
    // In a real app, this would interact with smart contracts
    const message: Message = {
      id: generateMessageId(),
      sender: address,
      content: newMessage,
      timestamp: Math.floor(Date.now() / 1000),
      tokenGated: selectedRoom.isTokenGated,
    }

    // Simulate blockchain transaction delay
    setTimeout(() => {
      setMessages(prev => [...prev, message])
      setNewMessage('')
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const canAccessRoom = (room: ChatRoom) => {
    if (!room.isTokenGated) return true
    // In a real app, check token balance here
    return isConnected
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Blockchain Chat</h1>
            <Settings className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
          <WalletConnect />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-3">Chat Rooms</h2>
          <div className="space-y-2">
            {mockRooms.map(room => (
              <div
                key={room.id}
                onClick={() => canAccessRoom(room) && setSelectedRoom(room)}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-colors',
                  selectedRoom.id === room.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50',
                  !canAccessRoom(room) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {room.isTokenGated ? (
                    room.isPrivate ? (
                      <Lock className="h-4 w-4 text-red-500" />
                    ) : (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )
                  ) : (
                    <Hash className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="font-medium text-sm">{room.name}</span>
                  {!canAccessRoom(room) && (
                    <Zap className="h-3 w-3 text-yellow-500 ml-auto" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{room.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {room.memberCount}
                  </span>
                  {room.isTokenGated && (
                    <span className="text-yellow-600">
                      Min: {room.minTokenAmount} tokens
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedRoom.isTokenGated ? (
                selectedRoom.isPrivate ? (
                  <Lock className="h-5 w-5 text-red-500" />
                ) : (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )
              ) : (
                <Hash className="h-5 w-5 text-gray-500" />
              )}
              <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
              <span className="text-sm text-gray-500">
                {selectedRoom.memberCount} members
              </span>
            </div>
            {selectedRoom.isTokenGated && (
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Token Gated
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{selectedRoom.description}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div key={message.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {message.nftAvatar ? (
                  <img 
                    src={message.nftAvatar} 
                    alt="NFT Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  truncateAddress(message.sender)[2]
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {truncateAddress(message.sender)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.tokenGated && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                  {message.nftAvatar && (
                    <Image className="h-3 w-3 text-purple-500" />
                  )}
                </div>
                <p className="text-sm text-gray-900">{message.content}</p>
                {message.txHash && (
                  <a 
                    href={`https://etherscan.io/tx/${message.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    View on Etherscan ↗
                  </a>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {!isConnected ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">Connect your wallet to start chatting</p>
              <WalletConnect />
            </div>
          ) : !canAccessRoom(selectedRoom) ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">This room requires {selectedRoom.minTokenAmount} tokens to access</p>
              <Button variant="web3" size="sm">
                Get Tokens
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedRoom.name}...`}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                variant="web3"
                size="icon"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}