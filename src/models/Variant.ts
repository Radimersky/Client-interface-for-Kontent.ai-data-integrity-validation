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
  fromServerModel(serverModel: ProgramAccount<TypeDef<IdlAccountDef, IdlTypes<Idl>>>): Variant {
    const castedModel = serverModel as ProgramAccount<ServerVariant>;

    const author = castedModel.publicKey.toBase58();

    return {
      projectId: castedModel.account.projectId,
      itemId: castedModel.account.itemId,
      variantId: castedModel.account.variantId,
      variantHash: castedModel.account.variantHash,
      variantHashSignature: castedModel.account.variantHashSignature,
      publicKey: castedModel.publicKey.toBase58(),
      author: author,
      shortAuthor: author.slice(0, 4) + '..' + author.slice(-4),
      lastModified: dayjs.unix(castedModel.account.lastModified).format('YYYY-MM-DDTHH:mmZ'),
      accountCreated: dayjs.unix(castedModel.account.accountCreated).format('YYYY-MM-DDTHH:mmZ')
    };
  }
};
