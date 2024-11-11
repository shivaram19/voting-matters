// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingmattersIDL from '../target/idl/votingmatters.json'
import type { Votingmatters } from '../target/types/votingmatters'

// Re-export the generated IDL and type
export { Votingmatters, VotingmattersIDL }

// The programId is imported from the program IDL.
export const VOTINGMATTERS_PROGRAM_ID = new PublicKey(VotingmattersIDL.address)

// This is a helper function to get the Votingmatters Anchor program.
export function getVotingmattersProgram(provider: AnchorProvider) {
  return new Program(VotingmattersIDL as Votingmatters, provider)
}

// This is a helper function to get the program ID for the Votingmatters program depending on the cluster.
export function getVotingmattersProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingmatters program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return VOTINGMATTERS_PROGRAM_ID
  }
}
