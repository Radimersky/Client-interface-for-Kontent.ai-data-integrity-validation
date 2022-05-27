import { Container } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Variant } from '../models/Variant';
import { fetchVariants } from '../utils/api';
import useWorkspace from '../utils/useWorkspace';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { program, provider } = useWorkspace();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      return;
    }

    fetchVariants(program)
      .then((fetchedVariants) => {
        const serverVariants = fetchedVariants.map((variant) => Variant.fromServerModel(variant));
        setVariants(serverVariants);
        console.log(serverVariants);
      })
      .finally(() => {
        setLoading(false);
        console.log(variants);
        console.log(loading);
      });
  }, [loading]);

  return (
    <Container>
      {connected && (
        <>
          <p>{program.programId.toString()}</p>
          <p>{provider.wallet.publicKey.toString()}</p>
        </>
      )}
    </Container>
  );
};

export default BlockchainVariants;
