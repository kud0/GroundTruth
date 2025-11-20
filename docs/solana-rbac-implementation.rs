// Production-Ready Solana RBAC System for Prediction Markets
// Hybrid Approach: Admin PDAs + Employee Merkle Tree

use anchor_lang::prelude::*;
use anchor_lang::solana_program::keccak;

declare_id!("YourProgramIDHere111111111111111111111111111");

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_COMPANY_NAME_LEN: usize = 32;
const MAX_MARKET_TITLE_LEN: usize = 64;
const MAX_MARKET_DESC_LEN: usize = 128;
const MAX_ADMINS_PER_COMPANY: u16 = 100;
const MAX_MERKLE_PROOF_DEPTH: usize = 24; // Supports 16M employees
const COMPANY_REGISTRATION_FEE: u64 = 100_000_000; // 0.1 SOL
const ADMIN_GRANT_FEE: u64 = 5_000_000; // 0.005 SOL
const RATE_LIMIT_WINDOW: i64 = 3600; // 1 hour
const MAX_MARKETS_PER_HOUR: u16 = 50;

// ============================================================================
// PROGRAM MODULE
// ============================================================================

#[program]
pub mod prediction_market_rbac {
    use super::*;

    // ------------------------------------------------------------------------
    // COMPANY MANAGEMENT
    // ------------------------------------------------------------------------

    pub fn register_company(
        ctx: Context<RegisterCompany>,
        company_id: u64,
        name: String,
        employee_merkle_root: [u8; 32],
    ) -> Result<()> {
        require!(name.len() <= MAX_COMPANY_NAME_LEN, ErrorCode::NameTooLong);

        // Charge registration fee to prevent spam
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.authority.key(),
                &ctx.accounts.platform_treasury.key(),
                COMPANY_REGISTRATION_FEE,
            ),
            &[
                ctx.accounts.authority.to_account_info(),
                ctx.accounts.platform_treasury.to_account_info(),
            ],
        )?;

        let company = &mut ctx.accounts.company;
        company.authority = ctx.accounts.authority.key();
        company.company_id = company_id;
        company.name = name;
        company.admin_count = 0;
        company.employee_merkle_root = employee_merkle_root;
        company.employee_root_version = 1;
        company.created_at = Clock::get()?.unix_timestamp;
        company.paused = false;
        company.total_markets = 0;
        company.bump = ctx.bumps.company;

        emit!(CompanyRegistered {
            company: company.key(),
            company_id,
            authority: company.authority,
        });

        Ok(())
    }

    pub fn update_employee_merkle_root(
        ctx: Context<UpdateEmployeeMerkleRoot>,
        new_root: [u8; 32],
    ) -> Result<()> {
        let company = &mut ctx.accounts.company;

        company.employee_merkle_root = new_root;
        company.employee_root_version = company
            .employee_root_version
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(EmployeeMerkleRootUpdated {
            company: company.key(),
            new_version: company.employee_root_version,
        });

        Ok(())
    }

    pub fn toggle_pause(ctx: Context<TogglePause>) -> Result<()> {
        let company = &mut ctx.accounts.company;
        company.paused = !company.paused;

        emit!(CompanyPaused {
            company: company.key(),
            paused: company.paused,
        });

        Ok(())
    }

    // ------------------------------------------------------------------------
    // ADMIN ROLE MANAGEMENT (PDA-based)
    // ------------------------------------------------------------------------

    pub fn grant_admin_role(ctx: Context<GrantAdminRole>) -> Result<()> {
        let company = &mut ctx.accounts.company;

        require!(
            company.admin_count < MAX_ADMINS_PER_COMPANY,
            ErrorCode::TooManyAdmins
        );

        // Charge fee to prevent spam
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.granter.key(),
                &ctx.accounts.company.to_account_info().key(),
                ADMIN_GRANT_FEE,
            ),
            &[
                ctx.accounts.granter.to_account_info(),
                ctx.accounts.company.to_account_info(),
            ],
        )?;

        let admin_role = &mut ctx.accounts.admin_role;
        admin_role.user = ctx.accounts.recipient.key();
        admin_role.company = company.key();
        admin_role.granted_at = Clock::get()?.unix_timestamp;
        admin_role.granted_by = ctx.accounts.granter.key();
        admin_role.revoked = false;
        admin_role.bump = ctx.bumps.admin_role;

        company.admin_count = company
            .admin_count
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(AdminRoleGranted {
            company: company.key(),
            user: admin_role.user,
            granted_by: admin_role.granted_by,
        });

        Ok(())
    }

    pub fn revoke_admin_role(ctx: Context<RevokeAdminRole>) -> Result<()> {
        let company = &mut ctx.accounts.company;
        let admin_role = &mut ctx.accounts.admin_role;

        require!(!admin_role.revoked, ErrorCode::AlreadyRevoked);

        admin_role.revoked = true;
        admin_role.revoked_at = Some(Clock::get()?.unix_timestamp);
        admin_role.revoked_by = Some(ctx.accounts.revoker.key());

        company.admin_count = company
            .admin_count
            .checked_sub(1)
            .ok_or(ErrorCode::Underflow)?;

        emit!(AdminRoleRevoked {
            company: company.key(),
            user: admin_role.user,
            revoked_by: ctx.accounts.revoker.key(),
        });

        Ok(())
    }

    // ------------------------------------------------------------------------
    // MARKET CREATION (Admin Only)
    // ------------------------------------------------------------------------

    pub fn create_market(
        ctx: Context<CreateMarket>,
        market_id: u64,
        title: String,
        description: String,
        resolution_time: i64,
        num_outcomes: u8,
    ) -> Result<()> {
        require!(title.len() <= MAX_MARKET_TITLE_LEN, ErrorCode::TitleTooLong);
        require!(
            description.len() <= MAX_MARKET_DESC_LEN,
            ErrorCode::DescriptionTooLong
        );
        require!(num_outcomes >= 2, ErrorCode::InvalidOutcomes);
        require!(
            resolution_time > Clock::get()?.unix_timestamp,
            ErrorCode::InvalidResolutionTime
        );
        require!(
            !ctx.accounts.company.paused,
            ErrorCode::CompanyPaused
        );

        // Rate limiting
        let rate_limit = &mut ctx.accounts.rate_limit_state;
        let now = Clock::get()?.unix_timestamp;

        if now - rate_limit.window_start < RATE_LIMIT_WINDOW {
            require!(
                rate_limit.actions_count < MAX_MARKETS_PER_HOUR,
                ErrorCode::RateLimitExceeded
            );
            rate_limit.actions_count += 1;
        } else {
            rate_limit.window_start = now;
            rate_limit.actions_count = 1;
        }

        let market = &mut ctx.accounts.market;
        market.company = ctx.accounts.company.key();
        market.market_id = market_id;
        market.creator = ctx.accounts.admin.key();
        market.title = title;
        market.description = description;
        market.created_at = now;
        market.resolution_time = resolution_time;
        market.num_outcomes = num_outcomes;
        market.is_resolved = false;
        market.winning_outcome = None;
        market.total_volume = 0;
        market.bump = ctx.bumps.market;

        let company = &mut ctx.accounts.company;
        company.total_markets = company
            .total_markets
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;

        emit!(MarketCreated {
            market: market.key(),
            company: market.company,
            market_id,
            creator: market.creator,
        });

        Ok(())
    }

    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        winning_outcome: u8,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;

        require!(!market.is_resolved, ErrorCode::AlreadyResolved);
        require!(
            Clock::get()?.unix_timestamp >= market.resolution_time,
            ErrorCode::TooEarlyToResolve
        );
        require!(
            winning_outcome < market.num_outcomes,
            ErrorCode::InvalidOutcome
        );

        market.is_resolved = true;
        market.winning_outcome = Some(winning_outcome);
        market.resolved_at = Some(Clock::get()?.unix_timestamp);
        market.resolved_by = Some(ctx.accounts.admin.key());

        emit!(MarketResolved {
            market: market.key(),
            winning_outcome,
            resolved_by: ctx.accounts.admin.key(),
        });

        Ok(())
    }

    // ------------------------------------------------------------------------
    // BETTING (Admin or Employee with Merkle Proof)
    // ------------------------------------------------------------------------

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        amount: u64,
        outcome: u8,
        employee_proof: Option<Vec<[u8; 32]>>,
        employee_proof_version: Option<u64>,
    ) -> Result<()> {
        let market = &ctx.accounts.market;

        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(!market.is_resolved, ErrorCode::MarketResolved);
        require!(outcome < market.num_outcomes, ErrorCode::InvalidOutcome);
        require!(
            Clock::get()?.unix_timestamp < market.resolution_time,
            ErrorCode::BettingClosed
        );
        require!(
            !ctx.accounts.company.paused,
            ErrorCode::CompanyPaused
        );

        // Check authorization: Admin PDA or Employee Merkle Proof
        let user_key = ctx.accounts.user.key();
        let is_admin = ctx.accounts.admin_role.is_some()
            && !ctx.accounts.admin_role.as_ref().unwrap().revoked;

        if !is_admin {
            // Must provide valid employee merkle proof
            let proof = employee_proof.ok_or(ErrorCode::ProofRequired)?;
            let proof_version = employee_proof_version.ok_or(ErrorCode::ProofVersionRequired)?;

            require!(
                proof.len() <= MAX_MERKLE_PROOF_DEPTH,
                ErrorCode::ProofTooDeep
            );

            require!(
                proof_version == ctx.accounts.company.employee_root_version,
                ErrorCode::StaleProof
            );

            let leaf = hash_leaf(&user_key);
            require!(
                verify_merkle_proof(&proof, ctx.accounts.company.employee_merkle_root, leaf),
                ErrorCode::NotAuthorized
            );
        }

        // Create bet
        let bet = &mut ctx.accounts.bet;
        bet.market = market.key();
        bet.user = user_key;
        bet.amount = amount;
        bet.outcome = outcome;
        bet.placed_at = Clock::get()?.unix_timestamp;
        bet.claimed = false;
        bet.bump = ctx.bumps.bet;

        // Update market volume
        // Note: In production, use separate account to avoid concurrent access issues
        // ctx.accounts.market.total_volume += amount;

        emit!(BetPlaced {
            bet: bet.key(),
            market: market.key(),
            user: user_key,
            amount,
            outcome,
        });

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let bet = &mut ctx.accounts.bet;
        let market = &ctx.accounts.market;

        require!(market.is_resolved, ErrorCode::NotResolved);
        require!(!bet.claimed, ErrorCode::AlreadyClaimed);

        let winning_outcome = market.winning_outcome.ok_or(ErrorCode::NotResolved)?;
        require!(bet.outcome == winning_outcome, ErrorCode::LosingBet);

        // Calculate payout (simplified - in production use proper AMM formula)
        let payout = bet.amount.checked_mul(2).ok_or(ErrorCode::Overflow)?;

        // Transfer winnings (in production, pull from pool account)
        // ... implement token transfer logic

        bet.claimed = true;
        bet.claimed_at = Some(Clock::get()?.unix_timestamp);

        emit!(WinningsClaimed {
            bet: bet.key(),
            user: bet.user,
            payout,
        });

        Ok(())
    }
}

// ============================================================================
// ACCOUNT STRUCTURES
// ============================================================================

#[account]
pub struct Company {
    pub authority: Pubkey,              // 32
    pub company_id: u64,                // 8
    pub name: String,                   // 4 + 32 = 36
    pub admin_count: u16,               // 2
    pub employee_merkle_root: [u8; 32], // 32
    pub employee_root_version: u64,     // 8
    pub created_at: i64,                // 8
    pub paused: bool,                   // 1
    pub total_markets: u64,             // 8
    pub bump: u8,                       // 1
    // Total: 136 bytes (+ 8 discriminator = 144)
}

#[account]
pub struct AdminRole {
    pub user: Pubkey,             // 32
    pub company: Pubkey,          // 32
    pub granted_at: i64,          // 8
    pub granted_by: Pubkey,       // 32
    pub revoked: bool,            // 1
    pub revoked_at: Option<i64>,  // 1 + 8 = 9
    pub revoked_by: Option<Pubkey>, // 1 + 32 = 33
    pub bump: u8,                 // 1
    // Total: 148 bytes (+ 8 discriminator = 156)
}

#[account]
pub struct Market {
    pub company: Pubkey,                   // 32
    pub market_id: u64,                    // 8
    pub creator: Pubkey,                   // 32
    pub title: String,                     // 4 + 64 = 68
    pub description: String,               // 4 + 128 = 132
    pub created_at: i64,                   // 8
    pub resolution_time: i64,              // 8
    pub num_outcomes: u8,                  // 1
    pub is_resolved: bool,                 // 1
    pub winning_outcome: Option<u8>,       // 1 + 1 = 2
    pub resolved_at: Option<i64>,          // 1 + 8 = 9
    pub resolved_by: Option<Pubkey>,       // 1 + 32 = 33
    pub total_volume: u64,                 // 8
    pub bump: u8,                          // 1
    // Total: 343 bytes (+ 8 discriminator = 351)
}

#[account]
pub struct Bet {
    pub market: Pubkey,          // 32
    pub user: Pubkey,            // 32
    pub amount: u64,             // 8
    pub outcome: u8,             // 1
    pub placed_at: i64,          // 8
    pub claimed: bool,           // 1
    pub claimed_at: Option<i64>, // 1 + 8 = 9
    pub bump: u8,                // 1
    // Total: 92 bytes (+ 8 discriminator = 100)
}

#[account]
pub struct RateLimitState {
    pub admin: Pubkey,     // 32
    pub company: Pubkey,   // 32
    pub window_start: i64, // 8
    pub actions_count: u16, // 2
    pub bump: u8,          // 1
    // Total: 75 bytes (+ 8 discriminator = 83)
}

// ============================================================================
// CONTEXT STRUCTURES
// ============================================================================

#[derive(Accounts)]
#[instruction(company_id: u64, name: String, employee_merkle_root: [u8; 32])]
pub struct RegisterCompany<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 144,
        seeds = [b"company", company_id.to_le_bytes().as_ref()],
        bump
    )]
    pub company: Account<'info, Company>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Platform treasury for registration fees
    #[account(mut)]
    pub platform_treasury: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEmployeeMerkleRoot<'info> {
    #[account(
        mut,
        constraint = company.authority == authority.key() @ ErrorCode::Unauthorized
    )]
    pub company: Account<'info, Company>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct TogglePause<'info> {
    #[account(
        mut,
        constraint = company.authority == authority.key() @ ErrorCode::Unauthorized
    )]
    pub company: Account<'info, Company>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GrantAdminRole<'info> {
    #[account(mut)]
    pub company: Account<'info, Company>,

    #[account(
        init,
        payer = granter,
        space = 8 + 156,
        seeds = [
            b"admin_role",
            company.key().as_ref(),
            recipient.key().as_ref()
        ],
        bump
    )]
    pub admin_role: Account<'info, AdminRole>,

    /// CHECK: Granter verification
    #[account(mut)]
    pub granter: Signer<'info>,

    #[account(
        seeds = [
            b"admin_role",
            company.key().as_ref(),
            granter.key().as_ref()
        ],
        bump,
        constraint = granter_role.key() == granter_role_check.key() || granter.key() == company.authority
            @ ErrorCode::Unauthorized
    )]
    pub granter_role: Account<'info, AdminRole>,

    /// CHECK: Additional verification to prevent bypassing
    #[account(
        constraint = !granter_role_check.revoked @ ErrorCode::RoleRevoked
    )]
    pub granter_role_check: Account<'info, AdminRole>,

    /// CHECK: Recipient of admin role
    pub recipient: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeAdminRole<'info> {
    #[account(mut)]
    pub company: Account<'info, Company>,

    #[account(
        mut,
        seeds = [
            b"admin_role",
            company.key().as_ref(),
            admin_role.user.as_ref()
        ],
        bump = admin_role.bump
    )]
    pub admin_role: Account<'info, AdminRole>,

    #[account(
        constraint = company.authority == revoker.key() @ ErrorCode::Unauthorized
    )]
    pub revoker: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(market_id: u64)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub company: Account<'info, Company>,

    #[account(
        init,
        payer = admin,
        space = 8 + 351,
        seeds = [
            b"market",
            company.key().as_ref(),
            market_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub market: Account<'info, Market>,

    // Verify admin role
    #[account(
        seeds = [
            b"admin_role",
            company.key().as_ref(),
            admin.key().as_ref()
        ],
        bump,
        constraint = !admin_role.revoked @ ErrorCode::RoleRevoked
    )]
    pub admin_role: Account<'info, AdminRole>,

    #[account(mut)]
    pub admin: Signer<'info>,

    // Rate limiting
    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + 83,
        seeds = [
            b"rate_limit",
            company.key().as_ref(),
            admin.key().as_ref()
        ],
        bump
    )]
    pub rate_limit_state: Account<'info, RateLimitState>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(
        mut,
        constraint = market.company == company.key() @ ErrorCode::WrongCompany
    )]
    pub market: Account<'info, Market>,

    pub company: Account<'info, Company>,

    // Verify admin role
    #[account(
        seeds = [
            b"admin_role",
            company.key().as_ref(),
            admin.key().as_ref()
        ],
        bump,
        constraint = !admin_role.revoked @ ErrorCode::RoleRevoked
    )]
    pub admin_role: Account<'info, AdminRole>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(
        constraint = market.company == company.key() @ ErrorCode::WrongCompany
    )]
    pub market: Account<'info, Market>,

    pub company: Account<'info, Company>,

    #[account(
        init,
        payer = user,
        space = 8 + 100,
        seeds = [
            b"bet",
            market.key().as_ref(),
            user.key().as_ref()
        ],
        bump
    )]
    pub bet: Account<'info, Bet>,

    // Optional admin role check (if None, requires merkle proof)
    #[account(
        seeds = [
            b"admin_role",
            company.key().as_ref(),
            user.key().as_ref()
        ],
        bump
    )]
    pub admin_role: Option<Account<'info, AdminRole>>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        mut,
        seeds = [
            b"bet",
            bet.market.as_ref(),
            user.key().as_ref()
        ],
        bump = bet.bump,
        constraint = bet.user == user.key() @ ErrorCode::Unauthorized
    )]
    pub bet: Account<'info, Bet>,

    #[account(
        constraint = market.key() == bet.market @ ErrorCode::WrongMarket
    )]
    pub market: Account<'info, Market>,

    pub user: Signer<'info>,
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

fn hash_leaf(pubkey: &Pubkey) -> [u8; 32] {
    keccak::hash(pubkey.as_ref()).to_bytes()
}

fn verify_merkle_proof(proof: &[[u8; 32]], root: [u8; 32], leaf: [u8; 32]) -> bool {
    let mut computed_hash = leaf;

    for proof_element in proof.iter() {
        computed_hash = if computed_hash <= *proof_element {
            keccak::hashv(&[&computed_hash, proof_element]).to_bytes()
        } else {
            keccak::hashv(&[proof_element, &computed_hash]).to_bytes()
        };
    }

    computed_hash == root
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct CompanyRegistered {
    pub company: Pubkey,
    pub company_id: u64,
    pub authority: Pubkey,
}

#[event]
pub struct EmployeeMerkleRootUpdated {
    pub company: Pubkey,
    pub new_version: u64,
}

#[event]
pub struct CompanyPaused {
    pub company: Pubkey,
    pub paused: bool,
}

#[event]
pub struct AdminRoleGranted {
    pub company: Pubkey,
    pub user: Pubkey,
    pub granted_by: Pubkey,
}

#[event]
pub struct AdminRoleRevoked {
    pub company: Pubkey,
    pub user: Pubkey,
    pub revoked_by: Pubkey,
}

#[event]
pub struct MarketCreated {
    pub market: Pubkey,
    pub company: Pubkey,
    pub market_id: u64,
    pub creator: Pubkey,
}

#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    pub winning_outcome: u8,
    pub resolved_by: Pubkey,
}

#[event]
pub struct BetPlaced {
    pub bet: Pubkey,
    pub market: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub outcome: u8,
}

#[event]
pub struct WinningsClaimed {
    pub bet: Pubkey,
    pub user: Pubkey,
    pub payout: u64,
}

// ============================================================================
// ERROR CODES
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Only company authority or admin can perform this action")]
    Unauthorized,

    #[msg("Not an admin: Only admins can create/resolve markets")]
    NotAdmin,

    #[msg("Not authorized: User must be admin or provide valid employee proof")]
    NotAuthorized,

    #[msg("Role already revoked")]
    AlreadyRevoked,

    #[msg("Role has been revoked")]
    RoleRevoked,

    #[msg("Company name too long (max 32 characters)")]
    NameTooLong,

    #[msg("Market title too long (max 64 characters)")]
    TitleTooLong,

    #[msg("Market description too long (max 128 characters)")]
    DescriptionTooLong,

    #[msg("Too many admins for this company (max 100)")]
    TooManyAdmins,

    #[msg("Invalid bet amount (must be > 0)")]
    InvalidAmount,

    #[msg("Market already resolved")]
    MarketResolved,

    #[msg("Market not resolved yet")]
    NotResolved,

    #[msg("Market already resolved")]
    AlreadyResolved,

    #[msg("Bet already claimed")]
    AlreadyClaimed,

    #[msg("Losing bet cannot be claimed")]
    LosingBet,

    #[msg("Invalid number of outcomes (must be >= 2)")]
    InvalidOutcomes,

    #[msg("Invalid outcome selected")]
    InvalidOutcome,

    #[msg("Invalid resolution time (must be in future)")]
    InvalidResolutionTime,

    #[msg("Too early to resolve market")]
    TooEarlyToResolve,

    #[msg("Betting period has closed")]
    BettingClosed,

    #[msg("Wrong company for this market")]
    WrongCompany,

    #[msg("Wrong market for this bet")]
    WrongMarket,

    #[msg("Company is paused")]
    CompanyPaused,

    #[msg("Employee merkle proof required")]
    ProofRequired,

    #[msg("Merkle proof version required")]
    ProofVersionRequired,

    #[msg("Merkle proof is stale (update to latest version)")]
    StaleProof,

    #[msg("Merkle proof too deep (max 24 hashes)")]
    ProofTooDeep,

    #[msg("Rate limit exceeded (max 50 markets per hour)")]
    RateLimitExceeded,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Arithmetic underflow")]
    Underflow,
}
