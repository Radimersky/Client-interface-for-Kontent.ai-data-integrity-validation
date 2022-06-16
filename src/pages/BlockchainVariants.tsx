import { Box, Button, Container, Grid } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import CircularProgress from '@mui/material/CircularProgress';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import useFetchBlockchainVariants from '../utils/useFetchBlockchainVariants';

const BlockchainVariants = () => {
  const { connected } = useWallet();

  const handleCheckConsistency = () => {};

  const Loader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={100} />
    </Box>
  );

  const { isFetching, errorMessage, variantCards } = useFetchBlockchainVariants();

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
