import { Button, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import VariantCard from '../components/variantCard/VariantCard';
import variants from '../variants.json';

const UnprocessedVariants = () => {
  const variantCards = variants.items.map((variantData) => (
    <VariantCard {...variantData.system} key={variantData.system.id} />
  ));

  return (
    <Container maxWidth="xl">
      <Box marginBottom={3}>
        <h1>Unprocessed variants</h1>
      </Box>
      <Grid container spacing={5}>
        {variantCards}
      </Grid>

      <RouterLink to="/blockchain">
        <Button variant="contained">Blockchain</Button>
      </RouterLink>
    </Container>
  );
};

export default UnprocessedVariants;
