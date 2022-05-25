import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import BlockchainVariants from './pages/BlockchainVariants';
import UnprocessedVariants from './pages/UnprocessedVariants';
import { CssBaseline, Typography } from '@mui/material';
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
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const [submitError, setSubmitError] = useState<string>();
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
      new TorusWalletAdapter(),
      new SolletWalletAdapter(),
      new SolongWalletAdapter(),
      new ExodusWalletAdapter(),
      new MathWalletAdapter()
    ],
    [network]
  );

  // Login to firestore
  useEffect(() => {
    try {
      signIn();
    } catch (err) {
      setSubmitError((err as { message?: string })?.message ?? 'Unknown error occurred');
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <CssBaseline />
        <NavigationMenu />
        {submitError && (
          <Typography variant="caption" textAlign="right" sx={{ color: 'error.main' }}>
            {submitError}
          </Typography>
        )}
        <Routes>
          <Route path="/" element={<UnprocessedVariants />} />
        </Routes>
        <Routes>
          <Route path={blockchainPage} element={<BlockchainVariants />} />
        </Routes>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export const blockchainPage = '/blockchain';

export default App;
