import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingmatters} from '../target/types/votingmatters'
import { startAnchor, BankrunProvider } from 'anchor-bankrun'
import { seed } from '@coral-xyz/anchor/dist/cjs/idl'

const IDL = require("../target/idl/votingmatters.json")
const votingmatters = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ")

describe('votingmatters', () => {
  // Configure the client to use the local cluster.
    let context;
    let provider;
    let votingMattersProgram : any;
    beforeAll(async () => {
      context = await startAnchor("",[{name: "votingMattersProgram", programId: votingmatters}],[])
      provider = new BankrunProvider(context);
      votingMattersProgram = new Program<Votingmatters>(
        IDL,
        provider
      );
    })
  it('initialize_poll', async () => {
      await votingMattersProgram.methods.initializePoll(
        new anchor.BN(1),
        new anchor.BN(1731426945),
        new anchor.BN(1731429000),
        "what is your favoruite type of milkshake ?"
      ).rpc();
      const [pollAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer,'le', 8)], votingmatters);
      console.log(pollAddress)

      const poll = await votingMattersProgram.account.poll.fetch(pollAddress);

      expect(poll.pollId.toNumber()).toEqual(1);
      expect(poll.pollStart.toNumber()).toEqual(1731426945)
      expect(poll.pollEnd.toNumber()).toEqual(1731429000)
      expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
      expect(poll.description.toString()).toEqual("what is your favoruite type of milkshake ?")

  })

  it('Intialize Candidate', async () => {
      await votingMattersProgram.methods.initializeCandidate(
        "hakuna_matata",
        new anchor.BN(1)
      ).rpc();

      const [candidateAddress] = PublicKey.findProgramAddressSync([
        // new anchor.BN("hakuna_matata")
        // new anchor.BN(1).toArrayLike[Buffer, 'le', 8],
      ],
        votingmatters
      )

  })
})