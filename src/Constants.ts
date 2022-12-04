import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Deliver API
export const deliverAPIBaseUrlQA = 'https://qa-deliver.freetls.fastly.net/';
export const deliverAPIBaseUrlProduction = 'https://deliver.kontent.ai/';

// Signature provider
export const signatureProviderAPIBaseUrlLocalhost = 'http://localhost:9000/.netlify/functions/api/';
export const signatureProviderAPIBaseUrlProduction =
  'https://signature-provider.netlify.app/.netlify/functions/api/';

// Solana network
export const solanaNetworkUrlLocalhost = 'http://127.0.0.1:8899';
export const solanaNetworkUrlDevnet = 'https://api.devnet.solana.com';
export const solanaNetworkUrlMainnet = 'https://api.mainnet-beta.solana.com';

// Wallet adapter network
export const walletAdapterNetworkTestnet = WalletAdapterNetwork.Testnet;
export const walletAdapterNetworkDevnet = WalletAdapterNetwork.Devnet;
export const walletAdapterNetworkMainnet = WalletAdapterNetwork.Mainnet;
