// Check Constants.ts for setting options

import {
  deliverAPIBaseUrlQA,
  signatureProviderAPIBaseUrlLocalhost,
  solanaNetworkUrlLocalhost
} from './Constants';

// Developement
export const deliverAPIBaseUrl = deliverAPIBaseUrlQA;
export const signatureProviderAPIBaseUrl = signatureProviderAPIBaseUrlLocalhost;
export const SolanaNetworkUrl = solanaNetworkUrlLocalhost;

// Production
// export const deliverAPIBaseUrl = deliverAPIBaseUrlProduction;
// export const signatureProviderAPIBaseUrl = signatureProviderAPIBaseUrlProduction;
// export const SolanaNetworkUrl = solanaNetworkUrlProduction;
