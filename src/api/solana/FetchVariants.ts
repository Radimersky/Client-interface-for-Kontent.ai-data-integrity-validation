// eslint-disable-next-line no-unused-vars
import { Program } from '@project-serum/anchor/dist/cjs/program';

// Fetches variants from blockchain.
export const fetchVariants = async (program: Program, filters: any[] = []) => {
  return await program.account.variant.all(filters);
};

export const authorFilter = (authorBase58PublicKey: any) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey
  }
});
