#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod votingmatters {
  
use super::*;

  pub fn initialize_poll(
    ctx: Context<InitializePoll>,       
    poll_id:u64, 
    poll_start : u64,
    poll_end : u64,
    description : String )->Result<()>{
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.poll_start = poll_start;
      poll.poll_end = poll_end;
      poll.description = description;
      poll.candidate_amount = 0;
      Ok(())
  }

  pub fn initialize_candidate(
    ctx:Context<InitializeCandidate>, 
    candidate_name : String,
    _poll_id : u64) ->Result<()>{
      let candidate = &mut ctx.accounts.candidate;
      candidate.candidate_name = candidate_name;
      candidate.candidate_vote = 0;
      // let poll = &mut ctx.accounts.poll;
      // poll.candidate_amount += 1;
      Ok(())
  }
}


#[derive(Accounts)]
#[instruction(poll_id : u64)]
pub struct InitializePoll<'info>{
  #[account(mut)]
  pub signer : Signer<'info>,

  #[account(
    // initiliazing acc
    init,
    // if you;ve init it does create the account , but however it doesn't have anything in teh account rn , you just allocated space for the account, but it's not in use yet , it'll be in use when you write code in initialize_poll function
    payer = signer,
    space = 8 + Poll::INIT_SPACE,
    // seeds
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll : Account<'info, Poll>,

  pub system_program : Program<'info, System>
}

#[derive(Accounts)]
#[instruction(candidate_name : String, poll_id : u64)]
pub struct InitializeCandidate<'info>{
  #[account(mut)]
  pub signer : Signer<'info>,

  //  we need to update the candiate_amount in the poll account after adding the candidate , so for which we need that poll account
  #[account(
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll : Account<'info, Poll>,


  #[account(
    init,
    payer = signer,
    space = 8 + Candidate::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate : Account<'info , Candidate>,
  pub system_program : Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
  #[max_len(40)]
  pub candidate_name : String,
  pub candidate_vote : u64
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id: u64,
  #[max_len(280)]
  pub description: String,
  pub poll_start: u64,
  pub poll_end : u64,
  pub candidate_amount : u64
}