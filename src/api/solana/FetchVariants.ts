import { Program } from '@project-serum/anchor/dist/cjs/program';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

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

export const projectIdFilter = (projectId: string) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      4, // Project ID string length prefix
    bytes: bs58.encode(Buffer.from(projectId))
  }
});

export const itemCodenameFilter = (itemCodename: string) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      4 + // Project ID string length prefix
      36 + // Project ID.
      4, // Item codename string length prefix
    bytes: bs58.encode(Buffer.from(itemCodename))
  }
});

export const variantIdFilter = (itemCodename: string, variantId: string) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      4 + // Project ID string length prefix
      36 + // Project ID.
      4 + // Item codename string length prefix
      itemCodename.length + // Item codename.
      4, // Variant ID string length prefix
    bytes: bs58.encode(Buffer.from(variantId))
  }
});
