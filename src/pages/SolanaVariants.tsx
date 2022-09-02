import { Box, Button, Container, Grid, Divider } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchSolanaVariants from '../hooks/useFetchSolanaVariants';
import { Loader } from '../components/Loader';
import { useEffect, useState } from 'react';
import SolanaVariantCard from '../components/solanaVariantCard/SolanaVariantCard';
import { Variant } from '../models/Variant';
import useWorkspace from '../hooks/useWorkspace';
import { deleteVariant } from '../api/solana/DeleteVariant';
import { tryRemoveDatabaseVariantByPublicKey } from '../utils/Firebase';
// import { User } from 'firebase/auth';

const cardsContainerStyle = {
  textAlign: 'center',
  margin: 'auto'
};

const createVariantCardDataGridBlock = (
  variantCards: JSX.Element[],
  emptyMessage: string,
  header: string
) => {
  return (
    <>
      <Box marginY={3}>
        <h2>{header}</h2>
      </Box>
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
  //const [databaseVariants, setDatabaseVariants] = useState<DatabaseVariant[]>([]);
  // const [user, setUser] = useState<User>();

  // useEffect(() => {
  //   onAuthChanged((u) => setUser(u ?? undefined));
  // }, []);

  useEffect(() => {
    const newVariantCards = solanaVariants.map((variant) => {
      const mappedVariant = Variant.fromSolanaAccount(variant.account, variant.publicKey);
      return (
        <SolanaVariantCard
          handleRemove={() => removeVariantFromBlockchain(mappedVariant.publicKey)}
          handleIntegrityViolation={() => handleIntegrityViolation(mappedVariant.publicKey)}
          variant={mappedVariant}
          isIntegrityViolated={false}
          walletKey={provider.wallet.publicKey}
          key={mappedVariant.publicKey}
        />
      );
    });
    setVariantCards(newVariantCards);
  }, [solanaVariants]);

  // useEffect(() => {
  //   // Call onSnapshot() to listen to changes
  //   const unsubscribe = onSnapshot(databaseVariantsCollection, (snapshot) => {
  //     // Access .docs property of snapshot
  //     setDatabaseVariants(snapshot.docs.map((doc) => doc.data()));
  //   });
  //   // Unsubscribe from listening to changes
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const removeVariantFromBlockchain = (publicKey: string) => {
    deleteVariant(program, provider, publicKey)
      .then(() => {
        removeVariantCardFromState(publicKey);
        tryRemoveDatabaseVariantByPublicKey(publicKey);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeVariantCardFromState = (publicKey: string) => {
    setVariantCards((prevCards) => {
      return prevCards.filter((item: any) => item.key !== publicKey);
    });
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
    //   return previousCards.concFat(variant);
    // });
    // // Remove variant card from previous array
    // handleRemoveVariantCard(publicKey);
  };

  const properVariantCards = createVariantCardDataGridBlock(
    variantCards,
    'There are no proper variants. Send some variants to blockchain first.',
    'Proper variants'
  );

  const vilatedVariantCards = createVariantCardDataGridBlock(
    violatedVariantCards,
    'There are no integrity violated variants.',
    'Integrity violated variants'
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
        <h1>Variants stored on Solana blockchain</h1>
        <Box marginTop={3}>
          <Button
            disabled={isFetching}
            variant="contained"
            startIcon={<CloudSyncIcon />}
            onClick={handleCheckConsistency}>
            Check consistency of all variants
          </Button>
        </Box>
        <h2 style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</h2>
        {connected ? (
          <>
            {isFetching && <Loader />}
            {vilatedVariantCards}
            {properVariantCards}
          </>
        ) : (
          <h2 style={{ textAlign: 'center' }}>Please connect your wallet.</h2>
        )}
      </Box>
    </Container>
  );
};

export default SolanaVariants;
