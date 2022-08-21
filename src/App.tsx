import React, { useEffect, useMemo } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import SolanaVariants from './pages/SolanaVariants';
import { CssBaseline } from '@mui/material';
import NavigationMenu from './components/NavigationMenu';
import {
  ExodusWalletAdapter,
  GlowWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { signIn } from './utils/firebase';
import LocalVariants from './pages/LocalVariants';
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Testnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new SolletWalletAdapter(),
      new SolongWalletAdapter(),
      new ExodusWalletAdapter(),
      new MathWalletAdapter()
    ],
    [network]
  );

  // Login to firestore and initialize blockchain workspace
  useEffect(() => {
    try {
      signIn();
    } catch (err) {
      console.error((err as { message?: string })?.message ?? 'Unknown error occurred');
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <CssBaseline />
        <NavigationMenu />
        <Routes>
          <Route path={localVariantsPage} element={<LocalVariants />} />
          <Route path={blockchainVariantsPage} element={<SolanaVariants />} />
        </Routes>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export const blockchainVariantsPage = '/blockchainVariants';
export const localVariantsPage = '/';

export default App;
