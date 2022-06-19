import { Box, Button, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchBlockchainVariants from '../utils/useFetchBlockchainVariants';
import { Loader } from '../components/Loader';
import { useEffect, useState } from 'react';
import BlockchainVariantCard from '../components/blockchainVariantCard/BlockchainVariantCard';
import { Variant } from '../models/Variant';
import useWorkspace from '../utils/useWorkspace';
import { deleteVariant } from '../api/solana/DeleteVariant';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { isFetching, errorMessage, blockchainVariants } = useFetchBlockchainVariants();
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [violatedVariantCards, setViolatedVariantCards] = useState<JSX.Element[]>([]);
  const { program, provider } = useWorkspace();

  useEffect(() => {
    const newVariantCards = blockchainVariants.map((variant) => {
      const mappedVariant = Variant.fromSolanaAccount(variant.account, variant.publicKey);
      return (
        <BlockchainVariantCard
          variant={mappedVariant}
          handleRemove={() => removeVariantFromBlockchain(mappedVariant.publicKey)}
          handleIntegrityViolation={() => handleIntegrityViolation(mappedVariant.publicKey)}
          isIntegrityViolated={false}
          key={mappedVariant.publicKey}
        />
      );
    });
    setVariantCards(newVariantCards);
  }, [blockchainVariants]);

  const removeVariantFromBlockchain = (publicKey: string) => {
    deleteVariant(program, provider, publicKey)
      .then(() => {
        removeVariantCard(publicKey);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeVariantCard = (publicKey: string) => {
    console.log('removing');
    console.log(variantCards);
    setVariantCards((prevCards) => {
      return prevCards.filter((item: any) => item.key !== publicKey);
    });
    console.log(variantCards);
  };

  const handleCheckConsistency = () => {};

  const handleIntegrityViolation = (publicKey: any) => {
    if (publicKey) setViolatedVariantCards((prev) => prev);
    // console.log(variantCards);
    // const variant = variantCards.find((item) => item.key === publicKey);
    // console.log(variant);
    // if (!variant) {
    //   return;
    // }
    // // Move variant card to new array
    // setViolatedVariantCards((previousCards) => {
    //   console.log('moving');
    //   return previousCards.concat(variant);
    // });
    // // Remove variant card from previous array
    // handleRemoveVariantCard(publicKey);
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
