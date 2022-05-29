import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../utils/solana_idl.json';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Wallet, Idl } from '@project-serum/anchor';

interface IWorkspaceProps {
  //readonly wallet: AnchorWallet | undefined;
  //readonly connection: Connection;
  readonly provider: AnchorProvider;
  readonly program: Program<any>;
}

const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(idl.metadata.address);
const network = 'http://127.0.0.1:8899';

const useWorkspace = (): IWorkspaceProps => {
  const wallet = useAnchorWallet();

  const connection = new Connection(network, preflightCommitment);
  const provider = new AnchorProvider(connection, wallet as Wallet, {
    preflightCommitment: preflightCommitment,
    commitment: commitment
  });
  const program = new Program(idl as any, programID, provider);
  return {
    //wallet,
    //connection,
    provider,
    program
  };
};

export default useWorkspace;
