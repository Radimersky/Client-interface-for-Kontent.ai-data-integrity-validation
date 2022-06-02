import { DeliverVariant } from './variantCard/LocalVariantCard';
import hash from 'object-hash';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import useWorkspace from '../utils/useWorkspace';
// eslint-disable-next-line no-unused-vars
import { BlockchainVariantData, sendVariant } from '../api/SendVariant';
import { BN } from '@project-serum/anchor';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';

type ISendVariantToBlockchainProps = {
  readonly deliverVariant: DeliverVariant;
  readonly projectId: string;
};

type KontentSignature = {
  readonly hash: string;
  readonly signature: string;
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
  padding: '10px',
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
    setFirstMessage(messages.retrievingSignature);

    const localHash = hash(deliverVariant);
    signatureData = getSignature();
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
    const sendVariantToBlockchain = async (variantData: BlockchainVariantData) => {
      await sendVariant(program, provider, variantData);
    };

    setFirstMessage(messages.sendingToBlockchain);

    const variantData = createBlockchainVariantData(deliverVariant, projectId);
    console.log(variantData);
    sendVariantToBlockchain(variantData)
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

  const getSignature = (): KontentSignature => {
    const variantHash = hash(deliverVariant);
    return { hash: variantHash, signature: '1234abcd' };
  };

  const startProcess = () => {
    setLoading(true);
    setState(State.Signing);
  };

  const toTimestamp = (strDate: string) => {
    const dt = new Date(strDate).getTime();
    // From millis to seconds
    return dt / 1000;
  };

  const createBlockchainVariantData = (
    deliverVariant: DeliverVariant,
    projectId: string
  ): BlockchainVariantData => {
    const lastModifiedTimestamp = toTimestamp(deliverVariant.system.last_modified);
    console.log(signatureData);
    const variantData: BlockchainVariantData = {
      lastModified: new BN(lastModifiedTimestamp),
      variantId: deliverVariant.system.id,
      itemId: deliverVariant.system.language,
      projectId: projectId,
      variantHash: signatureData.hash,
      variantHashSignature: signatureData.signature
    };

    return variantData;
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
