// eslint-disable-next-line no-unused-vars
import { ProgramAccount, IdlTypes, Idl } from '@project-serum/anchor';
// eslint-disable-next-line no-unused-vars
import { IdlAccountDef } from '@project-serum/anchor/dist/cjs/idl';
// eslint-disable-next-line no-unused-vars
import { TypeDef } from '@project-serum/anchor/dist/cjs/program/namespace/types';

export type Variant = {
  readonly projectId: String;
};

export type ServerVariant = {
  readonly projectId: String;
};

export const Variant = {
  fromServerModel(serverModel: ProgramAccount<TypeDef<IdlAccountDef, IdlTypes<Idl>>>): Variant {
    return {
      projectId: serverModel.account.projectId as String
    };
  }
};
