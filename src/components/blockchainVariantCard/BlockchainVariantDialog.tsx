import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions } from '@mui/material';

export type DialogContent = {
  readonly title: string;
  readonly body: JSX.Element;
};

type IBlockchainVariantDialogProps = {
  readonly open: boolean;
  readonly handleConfirm: () => void;
  readonly handleDeny: () => void;
  readonly dialogContent: DialogContent;
};

const BlockchainVariantDialog: React.FC<IBlockchainVariantDialogProps> = ({
  open,
  handleDeny,
  handleConfirm,
  dialogContent
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{dialogContent.title}</DialogTitle>
      <DialogContent>{dialogContent.body}</DialogContent>
      <DialogActions>
        <Button onClick={handleDeny} sx={{ color: 'green' }}>
          No
        </Button>
        <Button onClick={handleConfirm} sx={{ color: 'red' }}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockchainVariantDialog;
