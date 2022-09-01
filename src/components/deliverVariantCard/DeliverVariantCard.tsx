import { Grid, Paper, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import StyledCardRow from '../StyledCardRow';
import DeliverVariantCardDetail from './DeliverVariantCardDetail';
import React from 'react';
import { DeliverVariantModel } from '../../models/Variant';
import { BN } from '@project-serum/anchor';
import dayjs from 'dayjs';

export type IDeliverVariantCardProps = {
  readonly deliverVariant: DeliverVariantModel;
  readonly projectId: string;
};

const formatIsoString = (isoString: string): string => {
  return dayjs(isoString).toString();
};

const DeliverVariantCard: React.FC<IDeliverVariantCardProps> = ({ deliverVariant, projectId }) => {
  const [open, setOpen] = React.useState(false);
  const { system } = { ...deliverVariant };

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
              <StyledCardRow name="Item ID" value={system.id} />
              <StyledCardRow name="Codename" value={system.codename} />
              <StyledCardRow name="Last Modified" value={formatIsoString(system.last_modified)} />
              <StyledCardRow name="Content Type" value={system.type} />
              <StyledCardRow name="Language" value={system.language} />
              <StyledCardRow name="Collection" value={system.collection} />
              <StyledCardRow name="Workflow Step" value={system.workflow_step} />
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
      <DeliverVariantCardDetail
        open={open}
        handleClose={handleClose}
        deliverVariant={deliverVariant}
        projectId={projectId}
      />
    </>
  );
};

export default DeliverVariantCard;
