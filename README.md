# Blockchain Chat - Decentralized Messaging Platform

A modern, real-time chat application built with Next.js and Web3 integration. Features token-gated rooms, NFT profile pictures, wallet connectivity, and smart contract integration.

## 🚀 Features

### Core Chat Features
- **Real-time messaging** with modern UI/UX
- **Multiple chat rooms** with different access levels
- **User-friendly interface** with responsive design
- **Message history** and timestamps

### Web3 Integration
- **Multi-wallet support** (MetaMask, WalletConnect, Coinbase Wallet)
- **Token-gated chat rooms** - Access based on token holdings
- **NFT profile pictures** - Display your NFT collection as avatars
- **Smart contract integration** - On-chain message verification
- **Multi-chain support** (Ethereum, Polygon, Arbitrum, Optimism, Base)
- **ENS name resolution** - Display .eth names instead of addresses

### Blockchain Features
- **Token-based access control** - Rooms requiring specific token amounts
- **DAO governance integration** - Special rooms for governance discussions
- **Transaction links** - View message transactions on block explorers
- **Balance display** - See your wallet balance directly in the app
- **Network switching** - Seamlessly switch between supported chains

## 🛠 Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, Ethers.js
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file and add your API keys:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_key
   NEXT_PUBLIC_INFURA_ID=your_infura_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Getting API Keys

1. **WalletConnect Project ID**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID

2. **Alchemy API Key**
   - Visit [Alchemy](https://alchemy.com/)
   - Create an account and new app
   - Copy the API key

3. **Infura API Key**
   - Visit [Infura](https://infura.io/)
   - Create an account and new project
   - Copy the Project ID

### Smart Contract Setup

To deploy your own chat contracts:

1. **Update contract addresses** in `src/lib/web3-config.ts`
2. **Deploy contracts** to your preferred networks
3. **Update the contract ABIs** for interaction

## 🎯 Usage

### Basic Chat
1. **Connect your wallet** using the "Connect Wallet" button
2. **Choose a chat room** from the sidebar
3. **Start messaging** with other connected users

### Token-Gated Rooms
1. **Ensure you have the required tokens** for premium rooms
2. **Your token balance is automatically checked**
3. **Access granted based on minimum token requirements**

### NFT Avatars
1. **NFT profile pictures** are automatically detected
2. **Displayed for verified NFT holders**
3. **Fallback to generated avatars** for non-NFT users

## 🏗 Architecture

### Component Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── blockchain-chat.tsx
│   └── wallet-connect.tsx
├── lib/                # Utility functions
│   ├── web3-config.ts  # Web3 configuration
│   └── utils.ts        # Helper functions
└── types/              # TypeScript type definitions
```

### Key Features Implementation

- **Wallet Connection**: Multi-provider support with auto-detection
- **Token Gating**: Smart contract balance checking
- **Message Storage**: Can be extended to IPFS or on-chain storage
- **Real-time Updates**: WebSocket integration ready
- **Cross-chain**: Multi-network message routing

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** with automatic builds

### Traditional Hosting
1. **Build the application**
   ```bash
   npm run build
   ```
2. **Start the production server**
   ```bash
   npm start
   ```

## 🔮 Future Enhancements

- [ ] **IPFS integration** for decentralized message storage
- [ ] **Encryption** for private messages
- [ ] **Voice/Video calls** with WebRTC
- [ ] **Bot integration** for automated responses
- [ ] **Governance voting** directly in chat
- [ ] **Staking rewards** for active chat participants
- [ ] **Cross-chain bridging** for multi-network tokens
- [ ] **AI moderation** for content filtering

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Commit your changes**
4. **Push to the branch**
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community (link coming soon)
- **Documentation**: Check the docs folder for detailed guides

---

Built with ❤️ for the decentralized future