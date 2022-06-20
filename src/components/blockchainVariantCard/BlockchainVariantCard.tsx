import { Grid, Paper, Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Variant } from '../../models/Variant';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CircularProgress from '@mui/material/CircularProgress';
import StyledCardRow from '../StyledCardRow';
import useBlockchainVariantCardStateManager, {
  VariantIntegrity
} from '../../utils/useBlockchainVariantCardStateManager';

interface IBlockchainVariantCardProps {
  readonly variant: Variant;
  readonly handleRemove: () => void;
  readonly handleIntegrityViolation: () => void;
  readonly isIntegrityViolated: boolean;
}

const boxStyling = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
  marginTop: '10px',
  backgroundColor: '#C5C5C5',
  borderRadius: '8px',
  padding: '15px'
};

const BlockchainVariantCard: React.FC<IBlockchainVariantCardProps> = ({
  variant,
  handleRemove,
  handleIntegrityViolation
}) => {
  const {
    checkIntegrity,
    checkingIntegrity,
    variantIntegrity,
    IntegrityCompromisationCheckDialog,
    infoMessage
  } = useBlockchainVariantCardStateManager(variant, handleIntegrityViolation);

  const [borderColor, setBorderColor] = useState('snow');

  useEffect(() => {
    switch (variantIntegrity) {
      case VariantIntegrity.Intact:
        setBorderColor('green');
        break;
      case VariantIntegrity.Compromised:
        setBorderColor('red');
        break;
      case VariantIntegrity.Deciding:
        setBorderColor('orange');
        break;
      default:
        setBorderColor('snow');
    }
  }, [variantIntegrity]);

  return (
    <>
      <Grid item xs={4} sx={{ minWidth: 400 }}>
        <Paper elevation={3} sx={{ borderColor: { borderColor }, borderStyle: 'solid' }}>
          <Box padding={2}>
            <Typography variant="body1" style={{ wordWrap: 'break-word' }}>
              <b>On-chain pubkey: {variant.publicKey}</b>
            </Typography>
            <Box marginY={1}>
              <StyledCardRow name="Created" value={variant.accountCreated} />
              <StyledCardRow name="Project ID" value={variant.projectId} />
              <StyledCardRow name="Item ID" value={variant.itemId} />
              <StyledCardRow name="Item code name" value={variant.itemCodename} />
              <StyledCardRow name="Variant ID" value={variant.variantId} />
              <StyledCardRow name="Last modified" value={variant.lastModifiedPretty} />
              <StyledCardRow name="Hash" value={variant.variantHash} />
              <StyledCardRow name="Hash signature" value={variant.variantHashSignature} />
            </Box>
            <Box sx={boxStyling}>{infoMessage}</Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Button
                disabled={checkingIntegrity || variantIntegrity === VariantIntegrity.Compromised}
                variant="contained"
                startIcon={checkingIntegrity ? <CircularProgress /> : <CloudSyncIcon />}
                onClick={checkIntegrity}>
                Check integrity
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemove}>
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <IntegrityCompromisationCheckDialog />
    </>
  );
};

export default BlockchainVariantCard;
