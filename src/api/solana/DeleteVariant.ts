import { AnchorProvider } from '@project-serum/anchor';
import { Program } from '@project-serum/anchor/dist/cjs/program';

// Deletes variant from blockchain.
export const deleteVariant = async (
  program: Program,
  provider: AnchorProvider,
  variantPubKey: any
) => {
  await program.rpc.deleteVariant({
    accounts: {
      author: provider.wallet.publicKey,
      variant: variantPubKey
    }
  });
};
