import { Program } from '@project-serum/anchor/dist/cjs/program';

// Fetches all variants from blockchain and applies filter when provided.
export const fetchVariants = async (program: Program, filters: any[] = []) => {
  return await program.account.variant.all(filters);
};

// Filters out variants created by author with given public key
export const authorFilter = (authorBase58PublicKey: any) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey
  }
});
