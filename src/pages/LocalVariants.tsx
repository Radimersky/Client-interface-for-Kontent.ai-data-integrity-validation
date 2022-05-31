import { Button, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import DeliverVariantCard from '../components/variantCard/DeliverVariantCard';
import variants from '../variants.json';
import DeliverVariantImport from '../components/DeliverVariantImport';

const LocalVariants = () => {
  const variantCards = variants.items.map((variantData) => (
    <DeliverVariantCard {...variantData} key={variantData.system.id} />
  ));

  const loadVariantsByProjectId = (projectId: string) => {
    console.log(projectId);
  };

  return (
    <Container maxWidth={false}>
      <DeliverVariantImport onSubmit={loadVariantsByProjectId} error={false} importing={false} />
      <Box marginY={3}>
        <h1>Local variants</h1>
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
