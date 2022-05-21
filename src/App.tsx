import React, { useMemo } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import BlockchainVariants from './pages/BlockchainVariants';
import UnprocessedVariants from './pages/UnprocessedVariants';
import { CssBaseline } from '@mui/material';
import NavigationMenu from './components/NavigationMenu';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Testnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter()
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <CssBaseline />
        <NavigationMenu />
        <Routes>
          <Route path="/" element={<UnprocessedVariants />} />
        </Routes>
        <Routes>
          <Route path="/blockchain" element={<BlockchainVariants />} />
        </Routes>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
