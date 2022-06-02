import { Button, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import LocalVariantCard from '../components/variantCard/LocalVariantCard';
import DeliverVariantImport from '../components/DeliverVariantImport';
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant } from '../models/Variant';

const LocalVariants = () => {
  const [variantCards, setVariantCards] = useState<JSX.Element[]>([]);

  //const deliverBaseUrl = "https://deliver.kontent.ai/";
  const deliverBaseUrl = 'https://qa-deliver.freetls.fastly.net/';

  const loadVariantsByProjectId = (projectId: string) => {
    fetch(deliverBaseUrl + projectId + '/items')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        const cards = data.items.map((variantData: DeliverVariant) => (
          <LocalVariantCard
            deliverVariant={variantData}
            key={variantData.system.id}
            projectId={projectId}
          />
        ));

        setVariantCards(cards);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
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
