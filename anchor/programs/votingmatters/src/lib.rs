#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod votingmatters {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingmatters>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votingmatters.count = ctx.accounts.votingmatters.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votingmatters.count = ctx.accounts.votingmatters.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingmatters>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.votingmatters.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingmatters<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Votingmatters::INIT_SPACE,
  payer = payer
  )]
  pub votingmatters: Account<'info, Votingmatters>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingmatters<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub votingmatters: Account<'info, Votingmatters>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub votingmatters: Account<'info, Votingmatters>,
}

#[account]
#[derive(InitSpace)]
pub struct Votingmatters {
  count: u8,
}
