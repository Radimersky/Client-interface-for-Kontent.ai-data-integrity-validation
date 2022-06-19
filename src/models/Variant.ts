// eslint-disable-next-line no-unused-vars
import { IdlTypes, Idl } from '@project-serum/anchor';
// eslint-disable-next-line no-unused-vars
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
// eslint-disable-next-line no-unused-vars
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { PublicKey } from '@solana/web3.js';
import dayjs from 'dayjs';
import { BN } from '@project-serum/anchor';

export type Variant = {
  readonly projectId: string;
  readonly itemId: string;
  readonly itemCodename: string;
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
  readonly itemCodename: string;
  readonly variantId: string;
  readonly variantHash: string;
  readonly variantHashSignature: string;
  readonly publicKey: PublicKey;
  readonly author: PublicKey;
  readonly lastModified: number;
  readonly accountCreated: number;
};

export type BlockchainVariant = {
  readonly lastModified: BN;
  readonly variantId: string;
  readonly itemId: string;
  readonly itemCodename: string;
  readonly projectId: string;
  readonly variantHash: string;
  readonly variantHashSignature: string;
};

export type System = {
  readonly id: string;
  readonly name: string;
  readonly codename: string;
  readonly language: string;
  readonly type: string;
  readonly collection: string;
  readonly sitemap_locations: never[];
  readonly last_modified: string;
  readonly workflow_step: string;
};

export type DeliverVariant = {
  readonly system: System;
  readonly elements: any;
};

export type KontentSignature = {
  readonly hash: string;
  readonly signature: string;
};

const toTimestamp = (strDate: string) => {
  const dt = new Date(strDate).getTime();
  // From millis to seconds
  return dt / 1000;
};

export const Variant = {
  fromSolanaAccount(
    serverAccount: TypeDef<IdlAccountDef, IdlTypes<Idl>>,
    publicKey: PublicKey
  ): Variant {
    const account = serverAccount as ServerVariant;

    const author = publicKey.toBase58();

    return {
      projectId: account.projectId,
      itemId: account.itemId,
      itemCodename: account.itemCodename,
      variantId: account.variantId,
      variantHash: account.variantHash,
      variantHashSignature: account.variantHashSignature,
      publicKey: publicKey.toBase58(),
      author: author,
      shortAuthor: author.slice(0, 4) + '..' + author.slice(-4),
      lastModified: dayjs.unix(account.lastModified).format('YYYY-MM-DDTHH:mmZ'),
      accountCreated: dayjs.unix(account.accountCreated).format('YYYY-MM-DDTHH:mmZ')
    };
  },

  toBlockchainModel(
    deliverVariant: DeliverVariant,
    projectId: string,
    signatureData: KontentSignature
  ): BlockchainVariant {
    const lastModifiedTimestamp = toTimestamp(deliverVariant.system.last_modified);
    const variantData: BlockchainVariant = {
      lastModified: new BN(lastModifiedTimestamp),
      variantId: deliverVariant.system.language,
      itemId: deliverVariant.system.id,
      itemCodename: deliverVariant.system.codename,
      projectId: projectId,
      variantHash: signatureData.hash,
      variantHashSignature: signatureData.signature
    };

    return variantData;
  }
};
