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

  const handleCheckIntegrity = () => {
    setCheckingIntegrity(true);
    setBorderColor(State.Default);

    getVariant(variant.projectId, variant.itemCodename, variant.variantId)
      .then((response) => {
        if (response.ok) return response.json();

        setBorderColor(State.Suspicious);
        checkVariantNotFound();
        throw response;
      })
      .then((deliverItem) => {
        const deliverVariant: DeliverVariant = deliverItem.item;

        const deliverVariantLastModified = new Date(deliverVariant.system.last_modified);
        const blockchainVariantLastModified = new Date(variant.lastModified);
        console.log(deliverVariantLastModified.toUTCString());
        console.log(blockchainVariantLastModified.toUTCString());

        if (deliverVariantLastModified != blockchainVariantLastModified) {
          setBorderColor(State.Suspicious);
          checkVariantIsObsolete(deliverVariantLastModified, blockchainVariantLastModified);
        } else if (!compareHashes(hash(deliverVariant), variant.variantHash)) {
          setBorderColor(State.IntegrityViolated);
          handleIntegrityViolation();
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
              <StyledCardRow name="Variant ID" value={variant.variantId} />
              <StyledCardRow name="Last modified" value={variant.lastModifiedPretty} />
              <StyledCardRow name="Hash" value={variant.variantHash} />
              <StyledCardRow name="Hash signature" value={variant.variantHashSignature} />
            </Box>
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
        handleConfirm={() => {
          setShowDialog(false);
          setBorderColor(State.IntegrityViolated);
          setIntegrityViolated(true);
          handleIntegrityViolation();
        }}
        handleDeny={makeVariantOk}
        dialogContent={dialogContent}
      />
    </>
  );
};

export default BlockchainVariantCard;
