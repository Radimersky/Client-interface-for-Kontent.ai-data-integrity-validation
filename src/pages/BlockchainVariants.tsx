import { Box, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import BlockchainVariantCard from '../components/variantCard/BlockchainVariantCard';
import { Variant } from '../models/Variant';
import { authorFilter, fetchVariants } from '../api/solana/FetchVariants';
import useWorkspace from '../utils/useWorkspace';
import CircularProgress from '@mui/material/CircularProgress';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { program, provider } = useWorkspace();
  // Type <BlockchainVariantCard[]>
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);
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

    setLoading(true);

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
        setLoading(false);
      });
  }, [connected]);

  return (
    <Container maxWidth={false}>
      <Box marginY={3}>
        <h1>Blockchain variants</h1>
      </Box>
      <Box color={'red'}>{errorMessage}</Box>
      {connected ? (
        <>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={100} />
            </Box>
          )}
          <Grid container spacing={4}>
            {variantCards}
          </Grid>
        </>
      ) : (
        <h2 style={{ textAlign: 'center' }}>Please connect your wallet.</h2>
      )}
    </Container>
  );
};

export default BlockchainVariants;
