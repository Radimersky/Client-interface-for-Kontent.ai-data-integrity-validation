import { Container } from '@mui/material';
import { ProgramAccount, IdlTypes } from '@project-serum/anchor';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { useEffect, useState } from 'react';
import { fetchVariants } from '../utils/api';
import useWorkspace from '../utils/useWorkspace';

const BlockchainVariants = () => {
  const { program, provider } = useWorkspace();
  const [variants, setVariants] = useState<ProgramAccount<TypeDef<any, IdlTypes<any>>>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariants(program)
      .then((fetchedVariants) => setVariants(fetchedVariants))
      .finally(() => {
        setLoading(false);
        console.log(variants);
        console.log(loading);
      });
  }, [loading]);

  return (
    <Container>
      <>
        <p>{program.programId.toString()}</p>
        <p>{provider.wallet.publicKey.toString()}</p>
      </>
    </Container>
  );
};

export default BlockchainVariants;
