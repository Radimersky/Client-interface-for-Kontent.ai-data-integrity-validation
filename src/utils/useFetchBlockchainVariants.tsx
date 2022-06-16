import { useEffect, useState } from 'react';
import useWorkspace from './useWorkspace';
import { useWallet } from '@solana/wallet-adapter-react';
import { authorFilter, fetchVariants } from '../api/solana/FetchVariants';
import { Variant } from '../models/Variant';
import BlockchainVariantCard from '../components/blockchainVariantCard/BlockchainVariantCard';

// Hook providing logged in user information
const useFetchBlockchainVariants = () => {
  const { program, provider } = useWorkspace();
  const { connected } = useWallet();
  // Type <BlockchainVariantCard[]>
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [fetching, setFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRemoveVariantCard = (publicKey: any) => {
    const newVariantCards: JSX.Element[] = variantCards.filter(
      (item: any) => item.publicKey !== publicKey
    );
    setVariantCards(newVariantCards);
  };

  useEffect(() => {
    if (!connected) {
      return;
    }

    setFetching(true);

    // Filter variants by connected wallet pubkey
    const filter = [authorFilter(provider.wallet.publicKey.toBase58())];

    fetchVariants(program, filter)
      .then((fetchedVariants) => {
        const variantCards = fetchedVariants.map((variant) => {
          const mappedVariant = Variant.fromSolanaAccount(variant.account, variant.publicKey);
          return (
            <BlockchainVariantCard
              variant={mappedVariant}
              program={program}
              provider={provider}
              handleRemoveVariantCard={() => handleRemoveVariantCard(mappedVariant.publicKey)}
              key={mappedVariant.publicKey}
            />
          );
        });
        setVariantCards(variantCards);
      })
      .catch((e) => {
        console.log(e);
        setErrorMessage('Error: ' + e.message);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [connected]);

  return { variantCards, isFetching: fetching, errorMessage };
};

export default useFetchBlockchainVariants;
