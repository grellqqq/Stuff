import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Blockchain utility functions
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

export function formatBalance(balance: bigint, decimals = 18, precision = 4): string {
  const divisor = BigInt(10 ** decimals)
  const quotient = balance / divisor
  const remainder = balance % divisor
  const remainingDecimals = remainder.toString().padStart(decimals, '0')
  return `${quotient}.${remainingDecimals.substring(0, precision)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function generateRoomId(participants: string[]): string {
  return participants.sort().join('-').toLowerCase()
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}