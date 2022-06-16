import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions } from '@mui/material';

type IBlockchainVariantDialogProps = {
  readonly open: boolean;
  readonly handleClose: () => void;
  readonly title: string;
  readonly content: string;
};

const BlockchainVariantDialog: React.FC<IBlockchainVariantDialogProps> = ({
  open,
  handleClose,
  title,
  content
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockchainVariantDialog;
