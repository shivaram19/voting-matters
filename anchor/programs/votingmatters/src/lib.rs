#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod voting {
  
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
    _poll_id : u64,
    candidate_name : String
  ) ->Result<()>{
      let poll = &mut ctx.accounts.poll;
      poll.candidate_amount += 1;
      let candidate = &mut ctx.accounts.candidate;
      candidate.candidate_name = candidate_name;
      candidate.candidate_vote = 0;
      Ok(())
  }

  pub fn vote(
    ctx:Context<Vote>,
    _poll_id : u64,
    _candidate_name : String
    )->Result<()>{
      let candidate = &mut ctx.accounts.candidate;
      candidate.candidate_vote += 1;
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
#[instruction(poll_id : u64, candidate_name : String)]
pub struct InitializeCandidate<'info>{
  #[account(mut)]
  pub signer : Signer<'info>,

  //  we need to update the candiate_amount in the poll account after adding the candidate , so for which we need that poll account
  #[account(
    // it should be muatable inorder for you to increase the candiadate count in the Poll account
    mut,
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

#[derive(Accounts)]
#[instruction(poll_id : u64, candidate_name : String)]
// in this case we wouldn't be using any system program cause we wouldn't be deriving any PDA , cause we're only updating data in teh existing account 
pub struct Vote<'info> {
  // here we wouldn't be using any macro #[account(mut)] cause , we're nit creating any account here , we're just adding values into the other accounts i.e we'll be updating values in the candidate
  pub signer : Signer<'info>,

  #[account(
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll : Account<'info, Poll>,
  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate : Account<'info, Candidate>,
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
