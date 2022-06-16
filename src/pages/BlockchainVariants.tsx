import { Box, Button, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchBlockchainVariants from '../utils/useFetchBlockchainVariants';
import { Loader } from '../components/Loader';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { isFetching, errorMessage, variantCards } = useFetchBlockchainVariants();

  const handleCheckConsistency = () => {};

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
