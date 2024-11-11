'use client'

import {getVotingmattersProgram, getVotingmattersProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useVotingmattersProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingmattersProgramId(cluster.network as Cluster), [cluster])
  const program = getVotingmattersProgram(provider)

  const accounts = useQuery({
    queryKey: ['votingmatters', 'all', { cluster }],
    queryFn: () => program.account.votingmatters.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votingmatters', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votingmatters: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingmattersProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingmattersProgram()

  const accountQuery = useQuery({
    queryKey: ['votingmatters', 'fetch', { cluster, account }],
    queryFn: () => program.account.votingmatters.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votingmatters', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votingmatters: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votingmatters', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votingmatters: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votingmatters', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votingmatters: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votingmatters', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votingmatters: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
