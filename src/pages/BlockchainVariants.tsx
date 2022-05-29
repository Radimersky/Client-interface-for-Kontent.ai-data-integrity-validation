import { Button, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import BlockchainVariantCard from '../components/variantCard/BlockchainVariantCard';
import { Variant } from '../models/Variant';
import { authorFilter, fetchVariants } from '../api/FetchVariants';
import useWorkspace from '../utils/useWorkspace';
// eslint-disable-next-line no-unused-vars
import { SendVariant, sendVariant } from '../api/SendVariant';
import { BN } from '@project-serum/anchor';

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

  const variantData: SendVariant = {
    lastModified: new BN(1551041404),
    variantId: 'bb1439d5-4ee2-4895-a4e4-5b0d9d8c754e',
    itemId: 'ad1439d5-4ee2-4895-a4e4-5b0d9d8c754e',
    projectId: 'bd1439d5-4ee2-4895-a4e4-5b0d9d8c754e',
    variantHash: '0x7368b03bea99c5525aa7a9ba0b121fc381a4134f90d0f1b4f436266ad0f2b43b',
    variantHashSignature: '0x7368b03bea99c5525aa7a9ba0b121fc381a4134f90d0f1b4f436266ad0f2b43b'
  };

  const sendVariantToBlockchain = async () => {
    const variant = await sendVariant(program, provider, variantData);
    setVariantCards([
      ...variantCards,
      <BlockchainVariantCard {...variant} key={variant.publicKey} />
    ]);
  };

  return (
    <Container maxWidth={false}>
      {connected && (
        <>
          <p>{program.programId.toString()}</p>
          <p>{provider.wallet.publicKey.toString()}</p>
          <Grid container spacing={4}>
            {variantCards}
          </Grid>
          <Button variant="contained" color="error" onClick={sendVariantToBlockchain}>
            Delete
          </Button>
        </>
      )}
    </Container>
  );
};

export default BlockchainVariants;
