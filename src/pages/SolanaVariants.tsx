import { Box, Container, Grid, Divider } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import useFetchSolanaVariants from '../hooks/useFetchSolanaVariants';
import { Loader } from '../components/Loader';
import { useEffect, useState } from 'react';
import { Variant } from '../models/Variant';
import useWorkspace from '../hooks/useWorkspace';
import { deleteVariant } from '../api/solana/DeleteVariant';
import { tryRemoveDatabaseVariantByPublicKey } from '../utils/Firebase';
import SolanaVariantCard from '../components/solanaVariantCard/SolanaVariantCard';

const cardsContainerStyle = {
  textAlign: 'center',
  margin: 'auto'
};

const createVariantCardDataGridBlock = (variantCards: JSX.Element[], emptyMessage: string) => {
  return (
    <>
      {variantCards.length === 0 ? (
        <Box sx={cardsContainerStyle}>{emptyMessage}</Box>
      ) : (
        <Grid container spacing={4} sx={{ textAlign: 'left' }}>
          {variantCards}
        </Grid>
      )}
      <Divider style={{ width: '100%', paddingTop: '50px' }} />
    </>
  );
};

const SolanaVariants = () => {
  const { connected } = useWallet();
  const { isFetching, errorMessage, solanaVariants } = useFetchSolanaVariants();
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [violatedVariantCards, setViolatedVariantCards] = useState<JSX.Element[]>([]);
  const { program, provider } = useWorkspace();

  useEffect(() => {
    const newVariantCards = solanaVariants.map((variant) => {
      const mappedVariant = Variant.fromSolanaAccount(variant.account, variant.publicKey);
      return (
        <SolanaVariantCard
          handleRemove={() => removeVariantFromBlockchain(mappedVariant.publicKey)}
          handleIntegrityViolation={() => handleIntegrityViolation(mappedVariant.publicKey)}
          variant={mappedVariant}
          walletKey={provider.wallet.publicKey}
          key={mappedVariant.publicKey}
        />
      );
    });
    setVariantCards(newVariantCards);
  }, [solanaVariants]);

  const removeVariantFromBlockchain = (publicKey: string) => {
    deleteVariant(program, provider, publicKey)
      .then(() => {
        removeVariantCardFromState(publicKey);
        tryRemoveDatabaseVariantByPublicKey(publicKey);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const removeVariantCardFromState = (publicKey: string) => {
    setVariantCards((prevCards) => {
      return prevCards.filter((item: any) => item.key !== publicKey);
    });
  };

  const handleIntegrityViolation = (publicKey: any) => {
    if (publicKey) setViolatedVariantCards((prev) => prev);
  };

  const accountVariantCards = createVariantCardDataGridBlock(
    variantCards,
    'There are no content item variants. Send some content item variants to blockchain first.'
  );

  return (
    <Container maxWidth={false}>
      <Box
        marginY={3}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center'
        }}>
        <h1>Solana content item variants</h1>
        <h2 style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</h2>
        {connected ? (
          <>
            {isFetching && <Loader />}
            {accountVariantCards}
          </>
        ) : (
          <h2 style={{ textAlign: 'center' }}>Please connect your wallet.</h2>
        )}
      </Box>
    </Container>
  );
};

export default SolanaVariants;
