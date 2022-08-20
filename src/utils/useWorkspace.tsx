import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../solana_idl.json';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Wallet, Idl } from '@project-serum/anchor';
import { SolanaNetworkUrl } from '../AppSettingConstants';

interface IWorkspaceProps {
  readonly provider: AnchorProvider;
  readonly program: Program<any>;
}

const preflightCommitment = 'processed';
const commitment = 'processed';
const programID = new PublicKey(idl.metadata.address);

const useWorkspace = (): IWorkspaceProps => {
  const wallet = useAnchorWallet();

  const connection = new Connection(SolanaNetworkUrl, preflightCommitment);
  const provider = new AnchorProvider(connection, wallet as Wallet, {
    preflightCommitment: preflightCommitment,
    commitment: commitment
  });
  const program = new Program(idl as Idl, programID, provider);

  return {
    provider,
    program
  };
};

export default useWorkspace;
