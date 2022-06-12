// eslint-disable-next-line no-unused-vars
import { AnchorProvider } from '@project-serum/anchor';
// eslint-disable-next-line no-unused-vars
import { Program } from '@project-serum/anchor/dist/cjs/program';

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
