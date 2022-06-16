import { Button, Container, Divider, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Link as RouterLink } from 'react-router-dom';
import LocalVariantCard from '../components/localVariantCard/LocalVariantCard';
import DeliverVariantImport from '../components/DeliverVariantImport';
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant } from '../models/Variant';
import { getVariants } from '../api/deliver/GetVariants';
import { getProjectLanguages } from '../api/deliver/GetProjectLanguages';
import React from 'react';

type VariantCards = {
  readonly language: string;
  readonly variantCards: JSX.Element[];
};

const LocalVariants = () => {
  const [variantCards, setVariantCards] = useState<VariantCards[]>([]);

  const loadVariantsByProjectId = (projectId: string) => {
    const variantCardsWithLanguage: VariantCards[] = [];

    getProjectLanguages(projectId)
      .then((languages) => {
        languages?.map((language) => {
          getVariants(projectId, language.codename)
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
                  projectId={projectId}
                  key={variantData.system.id}
                />
              ));

              const variantCardWithLanguage: VariantCards = {
                language: language.name,
                variantCards: cards
              };

              variantCardsWithLanguage.push(variantCardWithLanguage);
            })
            .then(() => {
              setVariantCards(variantCardsWithLanguage);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container maxWidth={false}>
      <DeliverVariantImport onSubmit={loadVariantsByProjectId} error={false} importing={false} />
      <Box marginTop={3}>
        <h1>Local variants</h1>
      </Box>

      {variantCards.map((variantCard) => {
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
