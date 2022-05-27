import { Container } from '@mui/material';
import { ProgramAccount, IdlTypes, Idl } from '@project-serum/anchor';
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Variant } from '../models/Variant';
import { fetchVariants } from '../utils/api';
import useWorkspace from '../utils/useWorkspace';

const BlockchainVariants = () => {
  const { connected } = useWallet();
  const { program, provider } = useWorkspace();
  const [variants, setVariants] = useState<ProgramAccount<TypeDef<IdlAccountDef, IdlTypes<Idl>>>[]>(
    []
  );
  //const [variants2, setVariants2] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      return;
    }

    fetchVariants(program)
      .then((fetchedVariants) => {
        setVariants(fetchedVariants);
        console.log(fetchedVariants);
      })
      .finally(() => {
        setLoading(false);
        console.log(variants);
        console.log(loading);
      });
  }, [loading]);

  // Tohle by asi šlo předělat do předchozího useEffectu
  useEffect(() => {
    const variantsArr = variants.map((variant) => Variant.fromServerModel(variant));
    console.log(variantsArr);
  }, [variants]);

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
