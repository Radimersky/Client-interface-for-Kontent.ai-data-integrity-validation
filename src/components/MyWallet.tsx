import React from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const MyWallet: React.FC = () => {
  return (
    <>
      <div className="multi-wrapper">
        <span className="button-wrapper">
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </span>
      </div>
    </>
  );
};

export default MyWallet;
