import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { System } from './variantCard/DeliverVariantCard';

interface IVariantDialogProps {
  readonly open: boolean;
  readonly handleClose: () => void;
  readonly system: System;
  readonly elements: any;
}

const VariantDialog: React.FC<IVariantDialogProps> = ({ open, handleClose, system, elements }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {system.name + ' (' + system.codename + ')'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <pre>{JSON.stringify({ system, elements }, null, 2)}</pre>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VariantDialog;
