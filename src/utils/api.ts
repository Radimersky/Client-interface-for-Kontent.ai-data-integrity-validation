// eslint-disable-next-line no-unused-vars
import { Program } from '@project-serum/anchor/dist/cjs/program';

export const fetchVariants = async (program: Program) => {
  return await program.account.variant.all();
};
