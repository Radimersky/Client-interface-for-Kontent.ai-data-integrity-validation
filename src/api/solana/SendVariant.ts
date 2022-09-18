import { AnchorProvider, web3 } from '@project-serum/anchor';
import { Program } from '@project-serum/anchor/dist/cjs/program';
import { DtoVariant } from '../../models/Variant';

// Stores variant on blockchain
export const sendVariant = async (
  program: Program,
  provider: AnchorProvider,
  variantProps: DtoVariant
) => {
  // Create key pair for new variant account
  const variant = web3.Keypair.generate();

  await program.rpc.saveVariant(
    variantProps.projectId,
    variantProps.itemCodename,
    variantProps.variantId,
    variantProps.itemId,
    variantProps.variantHash,
    variantProps.variantHashSignature,
    variantProps.lastModified,
    {
      accounts: {
        variant: variant.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId
      },
      signers: [variant]
    }
  );
};
