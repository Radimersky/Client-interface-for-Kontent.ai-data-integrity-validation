import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Deliver API
export const deliverAPIBaseUrlQA = 'https://qa-deliver.freetls.fastly.net/';
export const deliverAPIBaseUrlProduction = 'https://deliver.kontent.ai/';

// Signature provider
export const signatureProviderAPIBaseUrlLocalhost = 'http://localhost:3001/';
export const signatureProviderAPIBaseUrlProduction = 'Enter-production-url-here';

// Solana network
export const solanaNetworkUrlLocalhost = 'http://127.0.0.1:8899';
export const solanaNetworkUrlProduction = 'Enter-production-url-here';

// Wallet adapter network
export const walletAdapterNetworkTestnet = WalletAdapterNetwork.Testnet;
export const walletAdapterNetworkDevnet = WalletAdapterNetwork.Devnet;
export const walletAdapterNetworkMainnet = WalletAdapterNetwork.Mainnet;
