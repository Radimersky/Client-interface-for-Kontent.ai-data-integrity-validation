// eslint-disable-next-line no-unused-vars
import { AnchorProvider, BN, web3 } from '@project-serum/anchor';
// eslint-disable-next-line no-unused-vars
import { Program } from '@project-serum/anchor/dist/cjs/program';
import { Variant } from '../models/Variant';

export type SendVariant = {
  lastModified: BN;
  variantId: string;
  itemId: string;
  projectId: string;
  variantHash: string;
  variantHashSignature: string;
};

// Stores variant on blockchain
export const sendVariant = async (
  program: Program,
  provider: AnchorProvider,
  sendVariant: SendVariant
) => {
  // Create key pair for new variant account
  const variant = web3.Keypair.generate();

  await program.rpc.saveVariant(
    sendVariant.variantId,
    sendVariant.itemId,
    sendVariant.projectId,
    sendVariant.variantHash,
    sendVariant.variantHashSignature,
    sendVariant.lastModified,
    {
      accounts: {
        variant: variant.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId
      },
      signers: [variant]
    }
  );

  const variantAccount = await program.account.variant.fetch(variant.publicKey);

  return Variant.fromServerModel(variantAccount, variant.publicKey);
};
