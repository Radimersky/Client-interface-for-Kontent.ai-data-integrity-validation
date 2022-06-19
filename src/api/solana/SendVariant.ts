// eslint-disable-next-line no-unused-vars
import { AnchorProvider, web3 } from '@project-serum/anchor';
// eslint-disable-next-line no-unused-vars
import { Program } from '@project-serum/anchor/dist/cjs/program';
// eslint-disable-next-line no-unused-vars
import { BlockchainVariant, Variant } from '../../models/Variant';

// Stores variant on blockchain
export const sendVariant = async (
  program: Program,
  provider: AnchorProvider,
  variantProps: BlockchainVariant
) => {
  // Create key pair for new variant account
  const variant = web3.Keypair.generate();

  await program.rpc.saveVariant(
    variantProps.variantId,
    variantProps.itemId,
    variantProps.itemCodename,
    variantProps.projectId,
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

  // TODO is this needed?
  const variantAccount = await program.account.variant.fetch(variant.publicKey);

  return Variant.fromSolanaAccount(variantAccount, variant.publicKey);
};
