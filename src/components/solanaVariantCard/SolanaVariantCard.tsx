import { Grid, Paper, Box, Button, Typography, TextField } from '@mui/material';
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
import { formatIsoString, solanaVariantIntegritytoIssueTypeMapper } from '../../utils/Utils';
import { DatabaseVariant, submitDocumentToDatabase } from '../../utils/Firebase';
import { PublicKey } from '@solana/web3.js';

interface ISolanaVariantCardProps {
  readonly variant: DeliverVariant;
  readonly handleRemove: () => void;
  readonly handleIntegrityViolation: () => void;
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
  padding: '15px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word'
};

const SolanaVariantCard: React.FC<ISolanaVariantCardProps> = ({
  variant,
  walletKey,
  handleRemove,
  handleIntegrityViolation
}) => {
  const [borderColor, setBorderColor] = useState('snow');
  const [bearer, setBearer] = useState('');

  const {
    checkIntegrity,
    checkingIntegrity,
    variantIntegrityState,
    IntegrityCompromisationCheckDialog,
    variantIntegrityInfoMessage,
    deliverVariantHash,
    authRequired
  } = useSolanaVariantCardStateManager(variant, bearer, handleIntegrityViolation, handleRemove);

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
        wallet: walletKey.toString(),
        compromisedHash: deliverVariantHash
      };

      submitDocumentToDatabase(dbVariant);
    }
  }, [variantIntegrityState]);

  useEffect(() => {
    console.log(variantIntegrityState);
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
              <b>
                On-chain pubkey:{' '}
                <a href={'https://explorer.solana.com/address/' + variant.publicKey}>
                  {variant.publicKey}
                </a>
              </b>
            </Typography>
            <Box marginY={1}>
              <StyledCardRow name="Created" value={formatIsoString(variant.accountCreated)} />
              <StyledCardRow name="Project ID" value={variant.projectId} />
              <StyledCardRow name="Variant ID" value={variant.variantId} />
              <StyledCardRow name="Item ID" value={variant.itemId} />
              <StyledCardRow name="Item codename" value={variant.itemCodename} />
              <StyledCardRow name="Last modified" value={variant.lastModifiedPretty} />
              <StyledCardRow name="Hash" value={variant.variantHash} />
              <StyledCardRow name="Hash signature" value={variant.variantHashSignature} />
            </Box>
            <Box sx={boxStyling}>{variantIntegrityInfoMessage}</Box>
            {authRequired && (
              <TextField
                id="filled-basic"
                label="Bearer token"
                variant="filled"
                onChange={(e) => setBearer(e.target.value)}
                disabled={checkingIntegrity}
                sx={{
                  width: '100%',
                  marginBottom: '25px',
                  borderRadius: '15px'
                }}
              />
            )}
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
SolanaVariantCard.displayName = 'SolanaVariantCard';
export default SolanaVariantCard;
