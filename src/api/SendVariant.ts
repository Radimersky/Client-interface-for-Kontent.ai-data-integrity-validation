// eslint-disable-next-line no-unused-vars
import { AnchorProvider, BN, web3 } from '@project-serum/anchor';
import { Program } from '@project-serum/anchor/dist/cjs/program';

// Stores variant on blockchain
export const sendVariant = async (program: Program, provider: AnchorProvider) => {
  // Create key pair for new variant account
  const variant = web3.Keypair.generate()

  await program.methods.saveVariant(
    'bb1439d5-4ee2-4895-a4e4-5b0d9d8c754e',
    'ad1439d5-4ee2-4895-a4e4-5b0d9d8c754e',
    'bd1439d5-4ee2-4895-a4e4-5b0d9d8c754e',
    '0x7368b03bea99c5525aa7a9ba0b121fc381a4134f90d0f1b4f436266ad0f2b43b',
    '0x7368b03bea99c5525aa7a9ba0b121fc381a4134f90d0f1b4f436266ad0f2b43b',
    new BN(1551041404),
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
  console.log(variantAccount);

  return variantAccount;
};

