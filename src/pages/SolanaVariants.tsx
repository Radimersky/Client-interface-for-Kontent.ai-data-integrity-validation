import { Box, Button, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchSolanaVariants from '../utils/useFetchSolanaVariants';
import { Loader } from '../components/Loader';
import { useEffect, useState } from 'react';
import SolanaVariantCard from '../components/solanaVariantCard/SolanaVariantCard';
import { Variant } from '../models/Variant';
import useWorkspace from '../utils/useWorkspace';
import { deleteVariant } from '../api/solana/DeleteVariant';
import { tryRemoveDatabaseVariantByPublicKey } from '../utils/firebase';
// import { User } from 'firebase/auth';

const SolanaVariants = () => {
  const { connected } = useWallet();
  const { isFetching, errorMessage, blockchainVariants } = useFetchSolanaVariants();
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [violatedVariantCards, setViolatedVariantCards] = useState<JSX.Element[]>([]);
  const { program, provider } = useWorkspace();
  //const [databaseVariants, setDatabaseVariants] = useState<DatabaseVariant[]>([]);
  // const [user, setUser] = useState<User>();

  // useEffect(() => {
  //   onAuthChanged((u) => setUser(u ?? undefined));
  // }, []);

  useEffect(() => {
    const newVariantCards = blockchainVariants.map((variant) => {
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
  }, [blockchainVariants]);

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
      <h2 style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</h2>
      {connected ? (
        <>
          {isFetching && <Loader />}

          <Box marginY={3}>
            <h2>Integrity violated variants</h2>
          </Box>
          <Grid container spacing={4}>
            {violatedVariantCards}
          </Grid>

          <Box marginY={3}>
            <h2>Proper variants</h2>
          </Box>
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

export default SolanaVariants;
