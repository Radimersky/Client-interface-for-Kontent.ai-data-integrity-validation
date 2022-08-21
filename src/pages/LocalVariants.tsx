import { Button, Container, Divider, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import DeliverVariantImport from '../components/DeliverVariantImport';
import { useState } from 'react';
import React from 'react';
// eslint-disable-next-line no-unused-vars
import useFetchLocalVariants, { LocalVariantCards } from '../hooks/useFetchLocalVariants';
import { Loader } from '../components/Loader';

const LocalVariants = () => {
  const [projectId, setProjectId] = useState('');
  const { variantCards, isFetching, errorMessage } = useFetchLocalVariants(projectId);

  const loadVariants = (projectId: string) => {
    setProjectId(projectId);
  };

  return (
    <Container maxWidth={false}>
      <DeliverVariantImport onSubmit={loadVariants} error={false} importing={isFetching} />
      <Box marginTop={3}>
        <h1>Local variants</h1>
      </Box>
      <Box color={'red'}>{errorMessage}</Box>
      {isFetching && <Loader />}

      {variantCards?.map((variantCard: LocalVariantCards) => {
        return (
          <React.Fragment key={variantCard.language}>
            <Box marginTop={4} marginBottom={1}>
              <h2>{variantCard.language}</h2>
            </Box>
            <Grid container spacing={4}>
              {variantCard.variantCards}
            </Grid>
            <Divider style={{ width: '100%', paddingTop: '50px' }} />
          </React.Fragment>
        );
      })}

      <RouterLink to="/blockchain">
        <Button variant="contained">Blockchain</Button>
      </RouterLink>
    </Container>
  );
};

export default LocalVariants;
