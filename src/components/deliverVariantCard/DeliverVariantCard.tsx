import { Grid, Paper, Box, Button } from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import StyledCardRow from '../StyledCardRow';
import DeliverVariantCardDetail from './DeliverVariantCardDetail';
import { useState } from 'react';
import { DeliverVariantModel } from '../../models/Variant';
import { formatIsoString } from '../../utils/Utils';
import {
  variantIdFilter,
  projectIdFilter,
  itemCodenameFilter,
  fetchVariants
} from '../../api/solana/FetchVariants';
import useWorkspace from '../../hooks/useWorkspace';

export type IDeliverVariantCardProps = {
  readonly deliverVariant: DeliverVariantModel;
  readonly projectId: string;
  readonly itemCodename: string;
  readonly variantLanguage: string;
};

const DeliverVariantCard: React.FC<IDeliverVariantCardProps> = ({
  deliverVariant,
  projectId,
  itemCodename,
  variantLanguage
}) => {
  const { program } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [isOnBlockchain, setIsOnBlockchain] = useState(false);
  const { system } = { ...deliverVariant };
  const [borderColor, setBorderColor] = useState('snow');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isVariantOnBlockchain = async (projectId: string, codename: string, language: string) => {
    const filter = [
      variantIdFilter(codename, language),
      projectIdFilter(projectId),
      itemCodenameFilter(codename)
    ];
    return (await fetchVariants(program, filter)).length !== 0;
  };

  isVariantOnBlockchain(projectId, itemCodename, variantLanguage).then((res) => {
    setIsOnBlockchain(res);
    if (res === true) setBorderColor('green');
  });

  return (
    <>
      <Grid item xs={3} sx={{ minWidth: 300 }}>
        <Paper elevation={3} sx={{ borderColor: { borderColor }, borderStyle: 'solid' }}>
          <Box padding={2}>
            <h2>
              <b>{system.name}</b>
            </h2>
            <Box marginY={1}>
              <StyledCardRow name="Item ID" value={system.id} />
              <StyledCardRow name="Codename" value={system.codename} />
              <StyledCardRow name="Last Modified" value={formatIsoString(system.last_modified)} />
              <StyledCardRow name="Content Type" value={system.type} />
              <StyledCardRow name="Language Codename" value={system.language} />
              <StyledCardRow name="Collection" value={system.collection} />
              <StyledCardRow name="Workflow Step" value={system.workflow_step} />
            </Box>
            <Box
              display={'flex'}
              justifyContent={'center'}
              flexDirection={'column'}
              textAlign={'center'}>
              <Button
                variant="contained"
                sx={{ width: '100%', marginBottom: '10px' }}
                startIcon={<ReadMoreIcon />}
                onClick={handleClickOpen}>
                Detail
              </Button>
              {isOnBlockchain && <h3>Already on blockchain</h3>}
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
