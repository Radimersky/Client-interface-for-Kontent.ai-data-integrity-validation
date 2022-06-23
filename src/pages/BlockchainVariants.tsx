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
import { addDoc, onSnapshot } from 'firebase/firestore';
import {
  DatabaseVariant,
  databaseVariantsCollection,
  // eslint-disable-next-line no-unused-vars
  IssueType,
  onAuthChanged
} from '../utils/firebase';
import { getAuth, signInAnonymously, User } from 'firebase/auth';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { isFetching, errorMessage, blockchainVariants } = useFetchBlockchainVariants();
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);
  const [violatedVariantCards, setViolatedVariantCards] = useState<JSX.Element[]>([]);
  const { program, provider } = useWorkspace();
  const [databaseVariants, setDatabaseVariants] = useState<DatabaseVariant[]>([]);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    onAuthChanged((u) => setUser(u ?? undefined));
  }, []);

  useEffect(() => {
    const newVariantCards = blockchainVariants.map((variant) => {
      const mappedVariant = Variant.fromSolanaAccount(variant.account, variant.publicKey);
      return (
        <BlockchainVariantCard
          handleRemove={() => removeVariantFromBlockchain(mappedVariant.publicKey)}
          handleIntegrityViolation={() => handleIntegrityViolation(mappedVariant.publicKey)}
          submitDataToDatabase={submitDataToDatabase}
          variant={mappedVariant}
          isIntegrityViolated={false}
          walletKey={provider.wallet.publicKey}
          key={mappedVariant.publicKey}
        />
      );
    });
    setVariantCards(newVariantCards);
  }, [blockchainVariants]);

  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Call onSnapshot() to listen to changes
    const unsubscribe = onSnapshot(databaseVariantsCollection, (snapshot) => {
      // Access .docs property of snapshot
      setDatabaseVariants(snapshot.docs.map((doc) => doc.data()));
      console.log('hello');
    });
    // Don't forget to unsubscribe from listening to changes
    return () => {
      unsubscribe();
    };
  }, [user]);

  const submitDataToDatabase = async (
    wallet: string,
    issueType: IssueType,
    variantPublicKey: string
  ) => {
    try {
      await addDoc(databaseVariantsCollection, {
        wallet: wallet,
        issueType: issueType,
        variantPublicKey: variantPublicKey
      });
      console.log('sent');
    } catch (err) {
      console.error((err as { message?: string })?.message ?? 'Unknown error occurred');
    }
  };

  const removeVariantFromBlockchain = (publicKey: string) => {
    deleteVariant(program, provider, publicKey)
      .then(() => {
        removeVariantCardFromState(publicKey);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeVariantCardFromState = (publicKey: string) => {
    setVariantCards((prevCards) => {
      return prevCards.filter((item: any) => item.key !== publicKey);
    });
    console.log(databaseVariants);
    console.log(user);
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

export default BlockchainVariants;
