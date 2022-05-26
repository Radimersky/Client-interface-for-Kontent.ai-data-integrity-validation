// eslint-disable-next-line no-unused-vars
import { Program } from '@project-serum/anchor/dist/cjs/program';

export const fetchVariants = async (program: Program) => {
  const variants = await program.account.variant.all();
  return variants;
};
