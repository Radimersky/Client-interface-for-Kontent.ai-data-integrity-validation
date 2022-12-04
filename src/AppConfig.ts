// Check Constants.ts for setting options

import {
  deliverAPIBaseUrlProduction,
  deliverAPIBaseUrlQA,
  signatureProviderAPIBaseUrlLocalhost,
  signatureProviderAPIBaseUrlProduction,
  solanaNetworkUrlDevnet,
  solanaNetworkUrlLocalhost,
  walletAdapterNetworkDevnet,
  walletAdapterNetworkTestnet
} from './Constants';

// Developement
export const deliverAPIBaseUrl = deliverAPIBaseUrlProduction;
export const signatureProviderAPIBaseUrl = signatureProviderAPIBaseUrlProduction;
export const SolanaNetworkUrl = solanaNetworkUrlDevnet;
export const WalletAdapterNetworkUrl = walletAdapterNetworkDevnet; // Should be same network as SolanaNetworkUrl
