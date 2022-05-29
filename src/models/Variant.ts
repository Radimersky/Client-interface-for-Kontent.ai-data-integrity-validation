// eslint-disable-next-line no-unused-vars
import { ProgramAccount, IdlTypes, Idl } from '@project-serum/anchor';
// eslint-disable-next-line no-unused-vars
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
// eslint-disable-next-line no-unused-vars
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { PublicKey } from '@solana/web3.js';
import dayjs from 'dayjs';

export type Variant = {
  readonly projectId: string;
  readonly itemId: string;
  readonly variantId: string;
  readonly variantHash: string;
  readonly variantHashSignature: string;
  readonly publicKey: string;
  readonly shortAuthor: string;
  readonly author: string;
  readonly lastModified: string;
  readonly accountCreated: string;
};

export type ServerVariant = {
  readonly projectId: string;
  readonly itemId: string;
  readonly variantId: string;
  readonly variantHash: string;
  readonly variantHashSignature: string;
  readonly publicKey: PublicKey;
  readonly author: PublicKey;
  readonly lastModified: number;
  readonly accountCreated: number;
};

export const Variant = {
  fromServerModel(
    serverAccount: TypeDef<IdlAccountDef, IdlTypes<Idl>>,
    publicKey: PublicKey
  ): Variant {
    const account = serverAccount as ServerVariant;

    const author = publicKey.toBase58();

    return {
      projectId: account.projectId,
      itemId: account.itemId,
      variantId: account.variantId,
      variantHash: account.variantHash,
      variantHashSignature: account.variantHashSignature,
      publicKey: publicKey.toBase58(),
      author: author,
      shortAuthor: author.slice(0, 4) + '..' + author.slice(-4),
      lastModified: dayjs.unix(account.lastModified).format('YYYY-MM-DDTHH:mmZ'),
      accountCreated: dayjs.unix(account.accountCreated).format('YYYY-MM-DDTHH:mmZ')
    };
  }
};
