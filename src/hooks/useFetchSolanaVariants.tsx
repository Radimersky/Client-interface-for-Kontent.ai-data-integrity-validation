import { useEffect, useState } from 'react';
import useWorkspace from './useWorkspace';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  authorFilter,
  fetchVariants,
  itemCodenameFilter,
  projectIdFilter,
  variantIdFilter
} from '../api/solana/FetchVariants';
import { ProgramAccount, IdlTypes, Idl } from '@project-serum/anchor';
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';

const useFetchSolanaVariants = () => {
  const { program, provider } = useWorkspace();
  const { connected } = useWallet();
  // Type <SolanaVariantCard[]>
  const [solanaVariants, setSolanaVariants] = useState<
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
        setSolanaVariants(fetchedVariants);
      })
      .catch((e) => {
        setErrorMessage('Error: ' + e.message);
        console.error(e);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [connected]);

  return { solanaVariants, isFetching: fetching, errorMessage };
};

export default useFetchSolanaVariants;
