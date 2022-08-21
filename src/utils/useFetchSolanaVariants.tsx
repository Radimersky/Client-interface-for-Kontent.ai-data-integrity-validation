import { useEffect, useState } from 'react';
import useWorkspace from './useWorkspace';
import { useWallet } from '@solana/wallet-adapter-react';
import { authorFilter, fetchVariants } from '../api/solana/FetchVariants';
import { ProgramAccount, IdlTypes, Idl } from '@project-serum/anchor';
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';

const useFetchSolanaVariants = () => {
  const { program, provider } = useWorkspace();
  const { connected } = useWallet();
  // Type <BlockchainVariantCard[]>
  const [blockchainVariants, setBlockchainVariants] = useState<
    ProgramAccount<TypeDef<IdlAccountDef, IdlTypes<Idl>>>[]
  >([]);
  const [fetching, setFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!connected) {
      return;
    }

    setFetching(true);

    // Filter variants by connected wallet pubkey
    const filter = [authorFilter(provider.wallet.publicKey.toBase58())];

    fetchVariants(program, filter)
      .then((fetchedVariants) => {
        setBlockchainVariants(fetchedVariants);
      })
      .catch((e) => {
        console.error(e);
        setErrorMessage('Error: ' + e.message);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [connected]);

  return { blockchainVariants, isFetching: fetching, errorMessage };
};

export default useFetchSolanaVariants;
