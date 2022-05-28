import { Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import BlockchainVariantCard from '../components/variantCard/BlockchainVariantCard';
import { Variant } from '../models/Variant';
import { fetchVariants } from '../utils/api';
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

    fetchVariants(program)
      .then((fetchedVariants) => {
        const variantCards = fetchedVariants.map((variant) => {
          const mappedVariant = Variant.fromServerModel(variant);
          return <BlockchainVariantCard {...mappedVariant} key={mappedVariant.publicKey} />;
        });
        setVariantCards(variantCards);
        console.log(variantCards);
      })
      .finally(() => {
        setLoading(false);
      });
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
