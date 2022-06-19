import { Box, Button, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchBlockchainVariants from '../utils/useFetchBlockchainVariants';
import { Loader } from '../components/Loader';
import { useEffect, useState } from 'react';
import BlockchainVariantCard from '../components/blockchainVariantCard/BlockchainVariantCard';
import { Variant } from '../models/Variant';
import useWorkspace from '../utils/useWorkspace';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { isFetching, errorMessage, blockchainVariants } = useFetchBlockchainVariants();
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [violatedVariantCards, setViolatedVariantCards] = useState<JSX.Element[]>([]);
  const { program, provider } = useWorkspace();

  useEffect(() => {
    const variantCards = blockchainVariants.map((variant) => {
      const mappedVariant = Variant.fromSolanaAccount(variant.account, variant.publicKey);
      return (
        <BlockchainVariantCard
          variant={mappedVariant}
          program={program}
          provider={provider}
          handleRemoveVariantCard={() => handleRemoveVariantCard(mappedVariant.publicKey)}
          handleIntegrityViolation={() => handleIntegrityViolation(mappedVariant.publicKey)}
          key={mappedVariant.publicKey}
        />
      );
    });
    setVariantCards(variantCards);
  }, [blockchainVariants]);

  const handleRemoveVariantCard = (publicKey: any) => {
    const newVariantCards: JSX.Element[] = variantCards.filter(
      (item: any) => item.key !== publicKey
    );
    setVariantCards(newVariantCards);
  };

  const handleCheckConsistency = () => {};

  const handleIntegrityViolation = (publicKey: any) => {
    const variant = variantCards.find((item: any) => item.key === publicKey);
    console.log(variant);
    if (!variant) {
      return;
    }
    // Move variant card to new array
    setViolatedVariantCards((previousCards) => previousCards.concat(variant));

    // Remove variant card from previous array
    handleRemoveVariantCard(publicKey);
  };

  return (
    <Container maxWidth={false}>
      <Button
        disabled={isFetching}
        variant="contained"
        startIcon={<CloudSyncIcon />}
        onClick={handleCheckConsistency}>
        Check consistency
      </Button>
      <Box marginY={3}>
        <h1>Blockchain variants</h1>
      </Box>
      <Box color={'red'}>{errorMessage}</Box>
      {connected ? (
        <>
          {isFetching && <Loader />}
          <Box marginY={3}>
            <h2>Proper variants</h2>
          </Box>
          <Grid container spacing={4}>
            {variantCards}
          </Grid>
          <Box marginY={3}>
            <h2>Integrity violated variants</h2>
          </Box>
          <Grid container spacing={4}>
            {violatedVariantCards}
          </Grid>
        </>
      ) : (
        <h2 style={{ textAlign: 'center' }}>Please connect your wallet.</h2>
      )}
    </Container>
  );
};

export default BlockchainVariants;
