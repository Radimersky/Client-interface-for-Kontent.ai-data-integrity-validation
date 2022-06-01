import { Grid, Paper, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import StyledCardRow from './StyledCardRow';
import DeliverVariantModal from './DeliverVariantModal';
import React from 'react';

export type System = {
  readonly id: string;
  readonly name: string;
  readonly codename: string;
  readonly language: string;
  readonly type: string;
  readonly collection: string;
  readonly sitemap_locations: never[];
  readonly last_modified: string;
  readonly workflow_step: string;
};

export type DeliverVariant = {
  readonly system: System;
  readonly elements: any;
};

const DeliverVariantCard: React.FC<DeliverVariant> = ({ system, elements }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid item xs={3} sx={{ minWidth: 300 }}>
        <Paper elevation={3}>
          <Box padding={2}>
            <h2>
              <b>{system.name}</b>
            </h2>
            <Box marginY={1}>
              <StyledCardRow name="Variant ID" value={system.id} />
              <StyledCardRow name="Codename" value={system.codename} />
              <StyledCardRow name="Last modified" value={system.last_modified} />
              <StyledCardRow name="Type" value={system.type} />
              <StyledCardRow name="Language" value={system.language} />
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Button variant="contained" startIcon={<ReadMoreIcon />} onClick={handleClickOpen}>
                Detail
              </Button>
              <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <DeliverVariantModal
        open={open}
        handleClose={handleClose}
        system={system}
        elements={elements}
      />
    </>
  );
};

export default DeliverVariantCard;
