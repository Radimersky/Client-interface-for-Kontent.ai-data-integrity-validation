import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import { DeliverVariant } from '../../models/Variant';
import SendVariantToBlockchain from '../SendVariantToBlockchain';

type ILocalVariantCardDetailProps = {
  readonly open: boolean;
  readonly handleClose: () => void;
  readonly deliverVariant: DeliverVariant;
  readonly projectId: string;
};

const LocalVariantCardDetail: React.FC<ILocalVariantCardDetailProps> = ({
  open,
  handleClose,
  deliverVariant,
  projectId
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={'paper'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {deliverVariant.system.name + ' (' + deliverVariant.system.codename + ')'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: '30px' }}>
          <pre>{JSON.stringify(deliverVariant, null, 2)}</pre>
        </Box>
        <SendVariantToBlockchain deliverVariant={deliverVariant} projectId={projectId} />
      </DialogContent>
    </Dialog>
  );
};

export default LocalVariantCardDetail;
