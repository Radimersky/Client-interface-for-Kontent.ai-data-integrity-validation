import { Button, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import DeliverVariantCard from '../components/variantCard/DeliverVariantCard';
import variants from '../variants.json';

const LocalVariants = () => {
  const variantCards = variants.items.map((variantData) => (
    <DeliverVariantCard {...variantData} key={variantData.system.id} />
  ));

  return (
    <Container maxWidth={false}>
      <Box marginBottom={3}>
        <h1>Unprocessed variants</h1>
      </Box>
      <Grid container spacing={4}>
        {variantCards}
      </Grid>

      <RouterLink to="/blockchain">
        <Button variant="contained">Blockchain</Button>
      </RouterLink>
    </Container>
  );
};

export default LocalVariants;
