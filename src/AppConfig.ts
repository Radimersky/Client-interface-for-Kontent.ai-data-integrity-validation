// Check Constants.ts for setting options

import {
  deliverAPIBaseUrlProduction,
  deliverAPIBaseUrlQA,
  signatureProviderAPIBaseUrlLocalhost,
  solanaNetworkUrlLocalhost,
  walletAdapterNetworkTestnet
} from './Constants';

// Developement
// export const deliverAPIBaseUrl = deliverAPIBaseUrlQA;
export const signatureProviderAPIBaseUrl = signatureProviderAPIBaseUrlLocalhost;
export const SolanaNetworkUrl = solanaNetworkUrlLocalhost;
export const WalletAdapterNetworkUrl = walletAdapterNetworkTestnet;

// Production
export const deliverAPIBaseUrl = deliverAPIBaseUrlProduction;
// export const signatureProviderAPIBaseUrl = signatureProviderAPIBaseUrlProduction;
// export const SolanaNetworkUrl = solanaNetworkUrlProduction;
// export const WalletAdapterNetworkUrl = walletAdapterNetworkMainnet;
