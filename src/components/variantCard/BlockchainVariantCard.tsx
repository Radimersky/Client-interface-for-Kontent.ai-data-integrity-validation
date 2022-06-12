import { Grid, Paper, Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import StyledCardRow from './StyledCardRow';
import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Variant } from '../../models/Variant';
import { deleteVariant } from '../../api/solana/DeleteVariant';
import { AnchorProvider, Program } from '@project-serum/anchor';

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

  return (
    <>
      <Grid item xs={4} sx={{ minWidth: 400 }}>
        <Paper elevation={3}>
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
