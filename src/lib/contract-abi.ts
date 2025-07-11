// Chat Contract ABI
export const CHAT_CONTRACT_ABI = [
  // Read functions
  {
    inputs: [{ name: "roomId", type: "string" }],
    name: "getRoom",
    outputs: [
      {
        components: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "requiredToken", type: "address" },
          { name: "minTokenAmount", type: "uint256" },
          { name: "isTokenGated", type: "bool" },
          { name: "isActive", type: "bool" },
          { name: "creator", type: "address" },
          { name: "createdAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "roomId", type: "string" },
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    name: "getRoomMessages",
    outputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "content", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "roomId", type: "string" },
          { name: "isDeleted", type: "bool" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllRoomIds",
    outputs: [{ name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "roomId", type: "string" },
      { name: "user", type: "address" },
    ],
    name: "canAccessRoom",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      { name: "totalMessages", type: "uint256" },
      { name: "lastMessage", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "roomId", type: "string" }],
    name: "getRoomMessageCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // Write functions
  {
    inputs: [
      { name: "roomId", type: "string" },
      { name: "content", type: "string" },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "roomId", type: "string" },
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "isTokenGated", type: "bool" },
      { name: "requiredToken", type: "address" },
      { name: "minTokenAmount", type: "uint256" },
    ],
    name: "createRoom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: true, name: "roomId", type: "string" },
      { indexed: false, name: "content", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
      { indexed: false, name: "messageIndex", type: "uint256" },
    ],
    name: "MessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "roomId", type: "string" },
      { indexed: false, name: "name", type: "string" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "isTokenGated", type: "bool" },
      { indexed: false, name: "requiredToken", type: "address" },
      { indexed: false, name: "minTokenAmount", type: "uint256" },
    ],
    name: "RoomCreated",
    type: "event",
  },
] as const

// ERC20 Token ABI (for balance checking)
export const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// ERC721 NFT ABI (for NFT profile pictures)
export const ERC721_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Contract addresses type
export type ContractAddresses = {
  [chainId: number]: {
    chat: string
    governanceToken: string
    accessToken: string
  }
}