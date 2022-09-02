import hash from 'object-hash';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import useWorkspace from '../hooks/useWorkspace';
import { sendVariant } from '../api/solana/SendVariant';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import { DtoVariant, DeliverVariantModel, KontentSignature, Variant } from '../models/Variant';
import { getSignature } from '../api/signatureProvider/GetSignature';

type ISendVariantToBlockchainProviderProps = {
  readonly deliverVariant: DeliverVariantModel;
  readonly projectId: string;
};

enum State {
  Beginning,
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
  backgroundColor: '#C5C5C550',
  borderRadius: '8px',
  padding: '15px',
  minWidth: '400px'
};

const messages = {
  connectWallet: 'Connect your wallet to send variant to blockchain',
  retrievingSignature: 'Retrieving signature from Kontent signature provider',
  hashCompareFail: 'Hash comparison mismatch. Please contant Kontent.ai support service',
  sendingToBlockchain: 'Please approve the transaction',
  sendingToBlockchainFailed: 'Transaction failed',
  completed: 'Variant has been successfully sent to blockchain',
  failedToRetrieveSignature: 'Cannot get signature from Kontent signature provider server'
};

const createSendingStateMessage = (localHash: string, providerHash: string): JSX.Element => {
  return (
    <>
      <p>
        <b>Variant hash signed localy:</b>
      </p>
      <p>{localHash}</p>
      <p>
        <b>Variant hash signed by Kontent signature provider:</b>
      </p>
      <p>{providerHash}</p>
    </>
  );
};

const SendVariantToBlockchainProvider: React.FC<ISendVariantToBlockchainProviderProps> = ({
  deliverVariant,
  projectId
}) => {
  const { connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState(!connected ? messages.connectWallet : '');
  const [secondMessage, setSecondMessage] = useState(<></>);
  const [kontentSignature, setKontentSignature] = useState<KontentSignature>({
    signature: '',
    hash: ''
  });
  const [state, setState] = useState(State.Beginning);
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

    const deliverVariantHash = hash(deliverVariant);

    getSignature(deliverVariant)
      .then((response: KontentSignature | null | void) => {
        if (response) {
          setKontentSignature(response);
          setSecondMessage(createSendingStateMessage(deliverVariantHash, response.hash));
          if (deliverVariantHash === response.hash) {
            setState(State.Sending);
          } else {
            setFirstMessage(messages.hashCompareFail);
            setLoading(false);
            setState(State.Failed);
          }
        } else {
          setFirstMessage(messages.failedToRetrieveSignature);
          setLoading(false);
          setState(State.Failed);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSendingState = () => {
    const sendVariantToBlockchain = async (solanaVariant: DtoVariant) => {
      await sendVariant(program, provider, solanaVariant);
    };

    setFirstMessage(messages.sendingToBlockchain);

    const solanaVariant = Variant.toDtoModel(deliverVariant, projectId, kontentSignature);

    sendVariantToBlockchain(solanaVariant)
      .then(() => {
        setState(State.Completed);
      })
      .catch((err) => {
        setFirstMessage(messages.sendingToBlockchainFailed);
        setSecondMessage(err?.message);
        setLoading(false);
        setState(State.Failed);
        console.error(err);
      });
  };

  const handleCompletedState = () => {
    setFirstMessage(messages.completed);
    setLoading(false);
  };

  const startProcedure = () => {
    setState(State.Signing);
  };

  return (
    <Box sx={boxStyling}>
      {connected && state === State.Beginning && (
        <Button
          sx={{ height: '40px' }}
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={startProcedure}>
          Send variant data to blockchain
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

export default SendVariantToBlockchainProvider;
