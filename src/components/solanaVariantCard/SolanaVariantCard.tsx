import { Grid, Paper, Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import { DeliverVariant } from '../../models/Variant';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CircularProgress from '@mui/material/CircularProgress';
import StyledCardRow from '../StyledCardRow';
import {
  useSolanaVariantCardStateManager,
  SolanaVariantIntegrityState
} from '../../hooks/useSolanaVariantCardStateManager';
import { solanaVariantIntegritytoIssueTypeMapper } from '../../utils/Utils';
import { DatabaseVariant, submitDocumentToDatabase } from '../../utils/Firebase';
import { PublicKey } from '@solana/web3.js';

interface ISolanaVariantCardProps {
  readonly variant: DeliverVariant;
  readonly handleRemove: () => void;
  readonly handleIntegrityViolation: () => void;
  readonly isIntegrityViolated: boolean;
  readonly walletKey: PublicKey;
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

const SolanaVariantCard: React.FC<ISolanaVariantCardProps> = ({
  variant,
  walletKey,
  handleRemove,
  handleIntegrityViolation
}) => {
  const [borderColor, setBorderColor] = useState('snow');

  const {
    checkIntegrity,
    checkingIntegrity,
    variantIntegrityState,
    IntegrityCompromisationCheckDialog,
    variantIntegrityInfoMessage
  } = useSolanaVariantCardStateManager(variant, handleIntegrityViolation, handleRemove);

  // Submit state changes to variant database
  useEffect(() => {
    if (
      variantIntegrityState === SolanaVariantIntegrityState.Unknown ||
      variantIntegrityState === SolanaVariantIntegrityState.Intact
    ) {
      return;
    }

    const issueType = solanaVariantIntegritytoIssueTypeMapper(variantIntegrityState);

    if (issueType) {
      const dbVariant: DatabaseVariant = {
        issueType,
        variantPublicKey: variant.publicKey,
        wallet: walletKey.toString()
      };

      submitDocumentToDatabase(dbVariant);
    }
  }, [variantIntegrityState]);

  useEffect(() => {
    switch (variantIntegrityState) {
      case SolanaVariantIntegrityState.Intact:
        setBorderColor('green');
        break;
      case SolanaVariantIntegrityState.Compromised:
        setBorderColor('red');
        break;
      case SolanaVariantIntegrityState.Obsolete:
        setBorderColor('orange');
        break;
      default:
        setBorderColor('snow');
    }
  }, [variantIntegrityState]);

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
            <Box sx={boxStyling}>{variantIntegrityInfoMessage}</Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Button
                disabled={
                  checkingIntegrity ||
                  variantIntegrityState === SolanaVariantIntegrityState.Compromised
                }
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

export default SolanaVariantCard;
