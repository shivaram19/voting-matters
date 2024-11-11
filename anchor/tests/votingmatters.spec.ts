import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingmatters} from '../target/types/votingmatters'

describe('votingmatters', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingmatters as Program<Votingmatters>

  const votingmattersKeypair = Keypair.generate()

  it('Initialize Votingmatters', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingmatters: votingmattersKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingmattersKeypair])
      .rpc()

    const currentCount = await program.account.votingmatters.fetch(votingmattersKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingmatters', async () => {
    await program.methods.increment().accounts({ votingmatters: votingmattersKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingmatters.fetch(votingmattersKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingmatters Again', async () => {
    await program.methods.increment().accounts({ votingmatters: votingmattersKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingmatters.fetch(votingmattersKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingmatters', async () => {
    await program.methods.decrement().accounts({ votingmatters: votingmattersKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingmatters.fetch(votingmattersKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingmatters value', async () => {
    await program.methods.set(42).accounts({ votingmatters: votingmattersKeypair.publicKey }).rpc()

    const currentCount = await program.account.votingmatters.fetch(votingmattersKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingmatters account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingmatters: votingmattersKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingmatters.fetchNullable(votingmattersKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
