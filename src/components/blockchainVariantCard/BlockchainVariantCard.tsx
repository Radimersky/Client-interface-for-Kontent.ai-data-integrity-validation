import { Grid, Paper, Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant, Variant } from '../../models/Variant';
import { deleteVariant } from '../../api/solana/DeleteVariant';
import { AnchorProvider, Program } from '@project-serum/anchor';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CircularProgress from '@mui/material/CircularProgress';
import { getVariant } from '../../api/deliver/GetVariant';
import hash from 'object-hash';
import StyledCardRow from '../StyledCardRow';

interface IBlockchainVariantCardProps {
  readonly variant: Variant;
  readonly provider: AnchorProvider;
  readonly program: Program<any>;
  readonly handleRemoveVariantCard: () => void;
}

const BlockchainVariantCard: React.FC<IBlockchainVariantCardProps> = ({
  variant,
  provider,
  program,
  handleRemoveVariantCard
}) => {
  const [open, setOpen] = React.useState(false);
  const [checkingConsistency, setCheckingIntegrity] = React.useState(false);
  const [borderColor, setBorderColor] = React.useState('snow');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    deleteVariant(program, provider, variant.publicKey)
      .then(() => {
        handleRemoveVariantCard();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const compareHashes = (deliverVariantHash: string, blockchainVariantHash: string) => {
    return deliverVariantHash.localeCompare(blockchainVariantHash) === 0;
  };

  const handleIntegrityViolation = () => {
    setBorderColor('red');
  };

  const checkVariantNotFound = () => {
    setBorderColor('orange');
  };

  const checkVariantIsObsolete = () => {
    setBorderColor('orange');
  };

  const handleCheckIntegrity = () => {
    setCheckingIntegrity(true);
    setBorderColor('snow');
    getVariant(variant.projectId, variant.itemId, variant.variantId)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        checkVariantNotFound();
        throw response;
      })
      .then((deliverVariant: DeliverVariant) => {
        if (new Date(deliverVariant.system.last_modified) != new Date(variant.lastModified)) {
          checkVariantIsObsolete();
        } else if (!compareHashes(hash(deliverVariant), variant.variantHash)) {
          handleIntegrityViolation();
        } else {
          setBorderColor('green');
        }
      })
      .catch((error) => {
        console.log(error);
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
              <StyledCardRow name="Last modified" value={variant.lastModified} />
              <StyledCardRow name="Hash" value={variant.variantHash} />
              <StyledCardRow name="Hash signature" value={variant.variantHashSignature} />
            </Box>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Button variant="contained" startIcon={<ReadMoreIcon />} onClick={handleClickOpen}>
                Detail
              </Button>
              <Button
                disabled={checkingConsistency}
                variant="contained"
                startIcon={checkingConsistency ? <CircularProgress /> : <CloudSyncIcon />}
                onClick={handleCheckIntegrity}>
                Check consistency
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      {open}
      {/* <VariantDialog open={open} handleClose={handleClose} system={system} elements={elements} /> */}
    </>
  );
};

export default BlockchainVariantCard;
