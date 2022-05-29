import { Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import BlockchainVariantCard from '../components/variantCard/BlockchainVariantCard';
import { Variant } from '../models/Variant';
import { authorFilter, fetchVariants } from '../api/FetchVariants';
import useWorkspace from '../utils/useWorkspace';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { program, provider } = useWorkspace();
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      return;
    }
    // Add asi filter to fetchVariants when rdy
    // eslint-disable-next-line no-unused-vars
    const filter = [authorFilter(provider.wallet.publicKey.toBase58())];

    fetchVariants(program)
      .then((fetchedVariants) => {
        const variantCards = fetchedVariants.map((variant) => {
          const mappedVariant = Variant.fromServerModel(variant);
          return <BlockchainVariantCard {...mappedVariant} key={mappedVariant.publicKey} />;
        });
        setVariantCards(variantCards);
        console.log(variantCards);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {});
  }, [loading]);

  return (
    <Container maxWidth={false}>
      {connected && (
        <>
          <p>{program.programId.toString()}</p>
          <p>{provider.wallet.publicKey.toString()}</p>
          <Grid container spacing={4}>
            {variantCards}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BlockchainVariants;
