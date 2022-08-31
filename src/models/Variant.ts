import { IdlTypes, Idl } from '@project-serum/anchor';
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { PublicKey } from '@solana/web3.js';
import dayjs from 'dayjs';
import { BN } from '@project-serum/anchor';

export type DeliverVariant = {
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
  readonly lastModifiedPretty: string;
  readonly accountCreated: string;
};

export type SolanaAccountVariant = {
  readonly projectId: string;
  readonly itemId: string;
  readonly itemCodename: string;
  readonly variantId: string;
  readonly variantHash: string;
  readonly variantHashSignature: string;
  readonly publicKey: PublicKey;
  readonly author: PublicKey;
  readonly lastModified: BN;
  readonly accountCreated: number;
};

export type DtoVariant = {
  readonly lastModified: BN;
  readonly variantId: string;
  readonly itemId: string;
  readonly itemCodename: string;
  readonly projectId: string;
  readonly variantHash: string;
  readonly variantHashSignature: string;
};

export type DeliverVariantModel = {
  readonly system: System;
  readonly elements: any;
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

export type KontentSignature = {
  readonly hash: string;
  readonly signature: string;
};

const toTimestamp = (strDate: string) => {
  const date = new Date(strDate).getTime();
  // From millis to seconds
  return date / 1000;
};

export const Variant = {
  fromSolanaAccount(
    solanaAccount: TypeDef<IdlAccountDef, IdlTypes<Idl>>,
    publicKey: PublicKey
  ): DeliverVariant {
    const account = solanaAccount as SolanaAccountVariant;
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
      lastModified: dayjs.unix(account.lastModified.toNumber()).toISOString(),
      lastModifiedPretty: dayjs.unix(account.lastModified.toNumber()).format('YYYY-MM-DDTHH:mmZ'),
      accountCreated: dayjs.unix(account.accountCreated).format('YYYY-MM-DDTHH:mmZ')
    };
  },

  toDtoModel(
    deliverVariant: DeliverVariantModel,
    projectId: string,
    signatureData: KontentSignature
  ): DtoVariant {
    const lastModifiedTimestamp = toTimestamp(deliverVariant.system.last_modified);
    const variantData: DtoVariant = {
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
