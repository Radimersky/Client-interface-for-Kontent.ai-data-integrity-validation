import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { System } from './DeliverVariantCard';

interface IDeliverVariantModalProps {
  readonly open: boolean;
  readonly handleClose: () => void;
  readonly system: System;
  readonly elements: any;
}

const DeliverVariantModal: React.FC<IDeliverVariantModalProps> = ({
  open,
  handleClose,
  system,
  elements
}) => {
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
          <pre>{JSON.stringify({ system, elements }, null, 2)}</pre>
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

export default DeliverVariantModal;
