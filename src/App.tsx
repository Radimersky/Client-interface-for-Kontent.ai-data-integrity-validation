import { useEffect, useMemo } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import SolanaVariants from './pages/SolanaVariants';
import { CssBaseline } from '@mui/material';
import NavigationMenu from './components/NavigationMenu';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { signIn } from './utils/Firebase';
import DeliverVariants from './pages/DeliverVariants';
import { WalletAdapterNetworkUrl } from './AppConfig';
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetworkUrl;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

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
          <Route path={deliverVariantsPage} element={<DeliverVariants />} />
          <Route path={solanaVariantsPage} element={<SolanaVariants />} />
        </Routes>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export const solanaVariantsPage = '/solanaVariants';
export const deliverVariantsPage = '/';

export default App;
