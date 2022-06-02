import hash from 'object-hash';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import useWorkspace from '../utils/useWorkspace';
// eslint-disable-next-line no-unused-vars
import { sendVariant } from '../api/solana/SendVariant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
// eslint-disable-next-line no-unused-vars
import { BlockchainVariant, DeliverVariant, Variant, KontentSignature } from '../models/Variant';
import { getSignature } from '../api/signatureProvider/GetSignature';

type ISendVariantToBlockchainProps = {
  readonly deliverVariant: DeliverVariant;
  readonly projectId: string;
};

enum State {
  Started,
  Signing,
  Sending,
  Completed,
  Failed
}

const boxStyling = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '150px',
  backgroundColor: '#C5C5C5',
  borderRadius: '8px',
  padding: '15px',
  minWidth: '00px'
};

const messages = {
  connectWallet: 'Connect your wallet to send variant to blockchain',
  retrievingSignature: 'Retrieving signature from Kontent',
  hashCompareFail: 'Hash comparison mismatch',
  sendingToBlockchain: 'Please approve the transaction',
  sendingToBlockchainFailed: 'Transaction failed',
  completed: 'Variant successfully sent to blockchain'
};

let signatureData = { signature: '', hash: '' };

const SendVariantToBlockchain: React.FC<ISendVariantToBlockchainProps> = ({
  deliverVariant,
  projectId
}) => {
  const { connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState(!connected ? messages.connectWallet : '');
  const [secondMessage, setSecondMessage] = useState('');
  const [state, setState] = useState(State.Started);
  const { program, provider } = useWorkspace();

  useEffect(() => {
    if (state === State.Signing) {
      handleSigningState();
    }

    if (state === State.Sending) {
      handleSendingState();
    }

    if (state === State.Completed) {
      handleCompletedState();
    }
  }, [state]);

  const handleSigningState = () => {
    setLoading(true);
    setFirstMessage(messages.retrievingSignature);

    const localHash = hash(deliverVariant);
    signatureData = getSignature(deliverVariant);
    console.log(signatureData);

    setSecondMessage(
      'Local variant hash:\n' + localHash + '\nKontent variant hash:\n' + signatureData.hash
    );

    if (localHash === signatureData.hash) {
      setState(State.Sending);
    } else {
      setFirstMessage(messages.hashCompareFail);
      setLoading(false);
      setState(State.Failed);
    }
  };

  const handleSendingState = () => {
    const sendVariantToBlockchain = async (blockchainVariant: BlockchainVariant) => {
      await sendVariant(program, provider, blockchainVariant);
    };

    setFirstMessage(messages.sendingToBlockchain);

    const blockchainVariant = Variant.toBlockchainModel(deliverVariant, projectId, signatureData);

    sendVariantToBlockchain(blockchainVariant)
      .then(() => {
        setState(State.Completed);
      })
      .catch((err) => {
        console.log(err);
        setFirstMessage(messages.sendingToBlockchainFailed);
        setSecondMessage(err?.message);
        setLoading(false);
        setState(State.Failed);
      });
  };

  const handleCompletedState = () => {
    setFirstMessage(messages.completed);
    setLoading(false);
  };

  const startProcess = () => {
    setState(State.Signing);
  };

  return (
    <Box sx={boxStyling}>
      {connected && state === State.Started && (
        <Button
          sx={{ height: '40px' }}
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={startProcess}>
          Send to blockchain
        </Button>
      )}
      {loading && <CircularProgress />}
      {!loading && state === State.Completed && (
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 50 }} />
      )}
      {!loading && state === State.Failed && <ErrorIcon color="error" sx={{ fontSize: 50 }} />}
      <Typography marginBottom={1}>
        <b>{firstMessage}</b>
      </Typography>
      <Typography>{secondMessage}</Typography>
    </Box>
  );
};

export default SendVariantToBlockchain;
