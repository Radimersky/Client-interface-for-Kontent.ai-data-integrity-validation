import { Box, Container, Grid } from '@mui/material';
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

    // Filter variants by connected wallet pubkey
    const filter = [authorFilter(provider.wallet.publicKey.toBase58())];

    fetchVariants(program, filter)
      .then((fetchedVariants) => {
        const variantCards = fetchedVariants.map((variant) => {
          const mappedVariant = Variant.fromServerModel(variant.account, variant.publicKey);
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
      <Box marginY={3}>
        <h1>Blockchain variants</h1>
      </Box>
      {connected && (
        <>
          <Grid container spacing={4}>
            {variantCards}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BlockchainVariants;
