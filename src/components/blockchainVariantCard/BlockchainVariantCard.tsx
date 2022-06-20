import { Grid, Paper, Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant, Variant } from '../../models/Variant';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CircularProgress from '@mui/material/CircularProgress';
import { getVariant } from '../../api/deliver/GetVariant';
import hash from 'object-hash';
import StyledCardRow from '../StyledCardRow';
import BlockchainVariantDialog, { DialogContent } from './BlockchainVariantDialog';
import { deliverVariantNotFound, obsoleteBlockchainVariant } from '../../utils/dialogTemplates';

interface IBlockchainVariantCardProps {
  readonly variant: Variant;
  readonly handleRemove: () => void;
  readonly handleIntegrityViolation: () => void;
  readonly isIntegrityViolated: boolean;
}

enum State {
  IntegrityViolated = 'red',
  Consistent = 'green',
  Suspicious = 'orange',
  Default = 'snow'
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
  handleIntegrityViolation,
  isIntegrityViolated
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [borderColor, setBorderColor] = useState(State.Default);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: '',
    body: <></>
  });
  const [integrityViolated, setIntegrityViolated] = useState(isIntegrityViolated);
  const [infoMessage, setInfoMessage] = useState('');

  const makeVariantOk = () => {
    setBorderColor(State.Consistent);
    setShowDialog(false);
  };

  const compareHashes = (deliverVariantHash: string, blockchainVariantHash: string) => {
    return deliverVariantHash.localeCompare(blockchainVariantHash) === 0;
  };

  const checkVariantNotFound = () => {
    setDialogContent(deliverVariantNotFound);
    setShowDialog(true);
  };

  const checkVariantIsObsolete = (
    deliverVariantLastModified: Date,
    blockchainVariantLastModified: Date
  ) => {
    setDialogContent(
      obsoleteBlockchainVariant(deliverVariantLastModified, blockchainVariantLastModified)
    );
    setShowDialog(true);
  };

  const makeVariantIntegrityViolated = () => {
    setShowDialog(false);
    setBorderColor(State.IntegrityViolated);
    setInfoMessage('Integrity violated!');
    setIntegrityViolated(true);
    handleIntegrityViolation();
  };

  const handleCheckIntegrity = () => {
    setCheckingIntegrity(true);
    setBorderColor(State.Default);

    getVariant(variant.projectId, variant.itemCodename, variant.variantId)
      .then((response) => {
        if (response.ok) return response.json();
        else {
          setBorderColor(State.Suspicious);
          checkVariantNotFound();
          throw response;
        }
      })
      .then((deliverItem) => {
        const deliverVariant: DeliverVariant = deliverItem.item;

        const deliverVariantLastModified = new Date(deliverVariant.system.last_modified);
        const blockchainVariantLastModified = new Date(variant.lastModified);
        console.log(deliverVariantLastModified.getTime());
        console.log(blockchainVariantLastModified.getTime());

        // We need to remove millis from the date, because they were lost when blockchainVariantLastModified was converted from byte array (BN library) to date object
        if (
          deliverVariantLastModified.getTime() - deliverVariantLastModified.getMilliseconds() !==
          blockchainVariantLastModified.getTime()
        ) {
          setBorderColor(State.Suspicious);
          checkVariantIsObsolete(deliverVariantLastModified, blockchainVariantLastModified);
        } else if (!compareHashes(hash(deliverVariant), variant.variantHash)) {
          setBorderColor(State.IntegrityViolated);
          makeVariantIntegrityViolated();
        } else {
          setBorderColor(State.Consistent);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setCheckingIntegrity(false);
      });
  };

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
                disabled={checkingIntegrity || integrityViolated}
                variant="contained"
                startIcon={checkingIntegrity ? <CircularProgress /> : <CloudSyncIcon />}
                onClick={handleCheckIntegrity}>
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
      <BlockchainVariantDialog
        open={showDialog}
        handleConfirm={makeVariantIntegrityViolated}
        handleDeny={makeVariantOk}
        dialogContent={dialogContent}
      />
    </>
  );
};

export default BlockchainVariantCard;
