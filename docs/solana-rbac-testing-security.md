# Testing & Security Audit Guide

## Table of Contents
1. [Unit Testing Strategy](#unit-testing-strategy)
2. [Integration Testing](#integration-testing)
3. [Security Attack Simulations](#security-attack-simulations)
4. [Gas Optimization Testing](#gas-optimization-testing)
5. [Load Testing](#load-testing)
6. [Pre-Deployment Checklist](#pre-deployment-checklist)
7. [Monitoring & Incident Response](#monitoring--incident-response)

---

## 1. Unit Testing Strategy

### Test File Structure

```typescript
// tests/unit/company.test.ts
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { expect } from 'chai';
import { PredictionMarketRbac } from '../target/types/prediction_market_rbac';

describe('Company Management', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.PredictionMarketRbac as Program<PredictionMarketRbac>;

  let companyAuthority: anchor.web3.Keypair;
  let platformTreasury: anchor.web3.Keypair;

  beforeEach(() => {
    companyAuthority = anchor.web3.Keypair.generate();
    platformTreasury = anchor.web3.Keypair.generate();
  });

  it('registers company successfully', async () => {
    const companyId = 1;
    const name = 'Test Company';
    const employeeMerkleRoot = new Array(32).fill(0);

    const [companyPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('company'), new anchor.BN(companyId).toArrayLike(Buffer, 'le', 8)],
      program.programId
    );

    // Airdrop for registration fee
    await provider.connection.requestAirdrop(
      companyAuthority.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await new Promise(resolve => setTimeout(resolve, 1000));

    await program.methods
      .registerCompany(new anchor.BN(companyId), name, employeeMerkleRoot)
      .accounts({
        company: companyPDA,
        authority: companyAuthority.publicKey,
        platformTreasury: platformTreasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([companyAuthority])
      .rpc();

    const companyAccount = await program.account.company.fetch(companyPDA);
    expect(companyAccount.name).to.equal(name);
    expect(companyAccount.companyId.toNumber()).to.equal(companyId);
    expect(companyAccount.adminCount).to.equal(0);
  });

  it('prevents company name exceeding 32 characters', async () => {
    const companyId = 2;
    const longName = 'A'.repeat(33); // Too long
    const employeeMerkleRoot = new Array(32).fill(0);

    const [companyPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('company'), new anchor.BN(companyId).toArrayLike(Buffer, 'le', 8)],
      program.programId
    );

    try {
      await program.methods
        .registerCompany(new anchor.BN(companyId), longName, employeeMerkleRoot)
        .accounts({
          company: companyPDA,
          authority: companyAuthority.publicKey,
          platformTreasury: platformTreasury.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([companyAuthority])
        .rpc();

      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('NameTooLong');
    }
  });

  it('charges registration fee', async () => {
    const companyId = 3;
    const name = 'Fee Test Company';
    const employeeMerkleRoot = new Array(32).fill(0);

    const [companyPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('company'), new anchor.BN(companyId).toArrayLike(Buffer, 'le', 8)],
      program.programId
    );

    const treasuryBalanceBefore = await provider.connection.getBalance(
      platformTreasury.publicKey
    );

    await program.methods
      .registerCompany(new anchor.BN(companyId), name, employeeMerkleRoot)
      .accounts({
        company: companyPDA,
        authority: companyAuthority.publicKey,
        platformTreasury: platformTreasury.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([companyAuthority])
      .rpc();

    const treasuryBalanceAfter = await provider.connection.getBalance(
      platformTreasury.publicKey
    );

    const expectedFee = 100_000_000; // 0.1 SOL
    expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(expectedFee);
  });
});
```

### Admin Role Tests

```typescript
// tests/unit/admin-roles.test.ts
describe('Admin Role Management', () => {
  let company: anchor.web3.PublicKey;
  let companyAuthority: anchor.web3.Keypair;
  let newAdmin: anchor.web3.Keypair;

  beforeEach(async () => {
    // Setup company
    companyAuthority = anchor.web3.Keypair.generate();
    newAdmin = anchor.web3.Keypair.generate();
    // ... register company
  });

  it('grants admin role successfully', async () => {
    const [adminRolePDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('admin_role'),
        company.toBuffer(),
        newAdmin.publicKey.toBuffer(),
      ],
      program.programId
    );

    // Company authority can grant without being admin
    await program.methods
      .grantAdminRole()
      .accounts({
        company: company,
        adminRole: adminRolePDA,
        granter: companyAuthority.publicKey,
        granterRole: adminRolePDA, // Placeholder
        granterRoleCheck: adminRolePDA,
        recipient: newAdmin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([companyAuthority])
      .rpc();

    const adminRoleAccount = await program.account.adminRole.fetch(adminRolePDA);
    expect(adminRoleAccount.revoked).to.be.false;
    expect(adminRoleAccount.user.toBase58()).to.equal(newAdmin.publicKey.toBase58());
  });

  it('prevents non-admin from granting roles', async () => {
    const unauthorizedUser = anchor.web3.Keypair.generate();
    const recipient = anchor.web3.Keypair.generate();

    const [adminRolePDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('admin_role'),
        company.toBuffer(),
        recipient.publicKey.toBuffer(),
      ],
      program.programId
    );

    try {
      await program.methods
        .grantAdminRole()
        .accounts({
          company: company,
          adminRole: adminRolePDA,
          granter: unauthorizedUser.publicKey,
          granterRole: adminRolePDA, // Invalid
          granterRoleCheck: adminRolePDA,
          recipient: recipient.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([unauthorizedUser])
        .rpc();

      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('Unauthorized');
    }
  });

  it('revokes admin role successfully', async () => {
    // First grant admin role
    const [adminRolePDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('admin_role'),
        company.toBuffer(),
        newAdmin.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods.grantAdminRole().accounts({ /* ... */ }).rpc();

    // Then revoke
    await program.methods
      .revokeAdminRole()
      .accounts({
        company: company,
        adminRole: adminRolePDA,
        revoker: companyAuthority.publicKey,
      })
      .signers([companyAuthority])
      .rpc();

    const adminRoleAccount = await program.account.adminRole.fetch(adminRolePDA);
    expect(adminRoleAccount.revoked).to.be.true;
    expect(adminRoleAccount.revokedBy.toBase58()).to.equal(
      companyAuthority.publicKey.toBase58()
    );
  });

  it('prevents exceeding max admin limit', async () => {
    // Grant 100 admins (max)
    for (let i = 0; i < 100; i++) {
      const admin = anchor.web3.Keypair.generate();
      // ... grant admin role
    }

    // Try to grant 101st admin
    const extraAdmin = anchor.web3.Keypair.generate();
    try {
      await program.methods.grantAdminRole().accounts({ /* ... */ }).rpc();
      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('TooManyAdmins');
    }
  });
});
```

### Merkle Proof Tests

```typescript
// tests/unit/merkle-proof.test.ts
import { keccak256 } from '@ethersproject/keccak256';
import { MerkleTree } from 'merkletreejs';

describe('Merkle Proof Verification', () => {
  let employees: anchor.web3.Keypair[];
  let merkleTree: MerkleTree;
  let merkleRoot: Buffer;

  beforeEach(() => {
    // Create 100 employee wallets
    employees = Array.from({ length: 100 }, () => anchor.web3.Keypair.generate());

    // Build merkle tree
    const leaves = employees.map(emp =>
      Buffer.from(keccak256(emp.publicKey.toBuffer()).slice(2), 'hex')
    );

    merkleTree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
      hashLeaves: false,
    });

    merkleRoot = merkleTree.getRoot();
  });

  it('employee can place bet with valid proof', async () => {
    const employee = employees[0];
    const leaf = Buffer.from(keccak256(employee.publicKey.toBuffer()).slice(2), 'hex');
    const proof = merkleTree.getProof(leaf).map(p => Array.from(p.data));

    // ... create market first

    const [betPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('bet'), market.toBuffer(), employee.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
      .accounts({
        market: market,
        company: company,
        bet: betPDA,
        adminRole: null,
        user: employee.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([employee])
      .rpc();

    const betAccount = await program.account.bet.fetch(betPDA);
    expect(betAccount.amount.toNumber()).to.equal(1_000_000_000);
  });

  it('rejects invalid merkle proof', async () => {
    const nonEmployee = anchor.web3.Keypair.generate();
    const leaf = Buffer.from(keccak256(nonEmployee.publicKey.toBuffer()).slice(2), 'hex');

    // Generate proof for a different employee but submit as non-employee
    const validEmployeeLeaf = Buffer.from(
      keccak256(employees[0].publicKey.toBuffer()).slice(2),
      'hex'
    );
    const proof = merkleTree.getProof(validEmployeeLeaf).map(p => Array.from(p.data));

    try {
      await program.methods
        .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
        .accounts({
          market: market,
          company: company,
          bet: betPDA,
          adminRole: null,
          user: nonEmployee.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([nonEmployee])
        .rpc();

      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('NotAuthorized');
    }
  });

  it('rejects stale proof after merkle root update', async () => {
    const employee = employees[0];
    const oldProof = merkleTree.getProof(/* ... */).map(p => Array.from(p.data));

    // Update merkle root (remove employee)
    const newEmployees = employees.slice(1);
    const newLeaves = newEmployees.map(emp =>
      Buffer.from(keccak256(emp.publicKey.toBuffer()).slice(2), 'hex')
    );
    const newMerkleTree = new MerkleTree(newLeaves, keccak256, {
      sortPairs: true,
      hashLeaves: false,
    });

    await program.methods
      .updateEmployeeMerkleRoot(Array.from(newMerkleTree.getRoot()))
      .accounts({
        company: company,
        authority: companyAuthority.publicKey,
      })
      .signers([companyAuthority])
      .rpc();

    // Try to use old proof with old version
    try {
      await program.methods
        .placeBet(new anchor.BN(1_000_000_000), 0, oldProof, new anchor.BN(1))
        .accounts({ /* ... */ })
        .signers([employee])
        .rpc();

      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('StaleProof');
    }
  });

  it('rejects proof that is too deep', async () => {
    const employee = employees[0];
    const excessiveProof = Array.from({ length: 25 }, () => new Array(32).fill(0));

    try {
      await program.methods
        .placeBet(new anchor.BN(1_000_000_000), 0, excessiveProof, new anchor.BN(1))
        .accounts({ /* ... */ })
        .signers([employee])
        .rpc();

      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('ProofTooDeep');
    }
  });
});
```

---

## 2. Integration Testing

### Multi-Company Scenario Tests

```typescript
// tests/integration/multi-company.test.ts
describe('Multi-Company Isolation', () => {
  let companyA: anchor.web3.PublicKey;
  let companyB: anchor.web3.PublicKey;
  let authorityA: anchor.web3.Keypair;
  let authorityB: anchor.web3.Keypair;
  let alice: anchor.web3.Keypair; // Admin in A, Employee in B

  beforeEach(async () => {
    // Setup two companies
    authorityA = anchor.web3.Keypair.generate();
    authorityB = anchor.web3.Keypair.generate();
    alice = anchor.web3.Keypair.generate();

    // Register both companies
    // ... registration logic
  });

  it('alice can create market for company A', async () => {
    // Grant Alice admin in Company A
    await program.methods.grantAdminRole().accounts({ /* Company A */ }).rpc();

    // Alice creates market in Company A
    const { marketAddress } = await createMarket(alice, companyA, 1);

    const marketAccount = await program.account.market.fetch(marketAddress);
    expect(marketAccount.company.toBase58()).to.equal(companyA.toBase58());
  });

  it('alice cannot create market for company B as admin', async () => {
    // Alice is admin in Company A, not B
    try {
      await createMarket(alice, companyB, 1);
      expect.fail('Should have thrown error');
    } catch (err: any) {
      // Should fail because Alice's admin role PDA is derived with Company A
      expect(err).to.exist;
    }
  });

  it('alice can bet on company B as employee', async () => {
    // Add Alice to Company B employee merkle tree
    const employeesB = [alice.publicKey, /* ... */];
    const { tree } = buildMerkleTree(employeesB);

    await program.methods
      .updateEmployeeMerkleRoot(Array.from(tree.getRoot()))
      .accounts({ company: companyB })
      .rpc();

    // Create market in Company B (by different admin)
    const marketB = await createMarket(adminB, companyB, 1);

    // Alice bets as employee
    const proof = tree.getProof(/* Alice */);
    await program.methods
      .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
      .accounts({ market: marketB, company: companyB, user: alice.publicKey })
      .rpc();

    // Success!
  });

  it('prevents cross-company market betting', async () => {
    // Employee from Company A tries to bet on Company B market
    const employeeA = anchor.web3.Keypair.generate();
    const marketB = await createMarket(adminB, companyB, 1);

    // Build proof for Company A
    const employeesA = [employeeA.publicKey];
    const { tree } = buildMerkleTree(employeesA);
    const proof = tree.getProof(/* employeeA */);

    try {
      await program.methods
        .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
        .accounts({
          market: marketB,
          company: companyA, // Wrong company!
          user: employeeA.publicKey,
        })
        .rpc();

      expect.fail('Should have thrown error');
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal('WrongCompany');
    }
  });
});
```

---

## 3. Security Attack Simulations

### Attack Test Suite

```typescript
// tests/security/attacks.test.ts
describe('Security Attack Simulations', () => {
  describe('Role Escalation Attacks', () => {
    it('employee cannot grant themselves admin role', async () => {
      const employee = anchor.web3.Keypair.generate();

      // Add employee to merkle tree (not admin)
      // ...

      const [employeeAdminRolePDA] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('admin_role'), company.toBuffer(), employee.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .grantAdminRole()
          .accounts({
            company: company,
            adminRole: employeeAdminRolePDA,
            granter: employee.publicKey,
            granterRole: employeeAdminRolePDA, // Doesn't exist or not admin
            recipient: employee.publicKey,
          })
          .signers([employee])
          .rpc();

        expect.fail('Should have thrown error');
      } catch (err: any) {
        // Should fail at account validation
        expect(err).to.exist;
      }
    });

    it('revoked admin cannot perform admin actions', async () => {
      const admin = anchor.web3.Keypair.generate();

      // Grant admin role
      await grantAdminRole(company, admin.publicKey);

      // Revoke admin role
      await revokeAdminRole(company, admin.publicKey);

      // Try to create market
      try {
        await createMarket(admin, company, 1);
        expect.fail('Should have thrown error');
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal('RoleRevoked');
      }
    });
  });

  describe('PDA Spoofing Attacks', () => {
    it('rejects fake admin role PDA with wrong seeds', async () => {
      const attacker = anchor.web3.Keypair.generate();

      // Attacker tries to create fake admin role account
      const fakeAdminRole = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .createMarket(/* ... */)
          .accounts({
            company: company,
            market: market,
            adminRole: fakeAdminRole.publicKey, // Not a valid PDA!
            admin: attacker.publicKey,
          })
          .signers([attacker, fakeAdminRole])
          .rpc();

        expect.fail('Should have thrown error');
      } catch (err: any) {
        // Anchor will reject because seeds don't match
        expect(err).to.exist;
      }
    });
  });

  describe('Merkle Proof Attacks', () => {
    it('rejects proof for different wallet', async () => {
      const employee1 = employees[0];
      const employee2 = employees[1];

      // Generate valid proof for employee1
      const proof1 = getProof(merkleTree, employee1.publicKey);

      // Employee2 tries to use employee1's proof
      try {
        await program.methods
          .placeBet(new anchor.BN(1_000_000_000), 0, proof1, new anchor.BN(1))
          .accounts({
            market: market,
            company: company,
            user: employee2.publicKey, // Different user!
          })
          .signers([employee2])
          .rpc();

        expect.fail('Should have thrown error');
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal('NotAuthorized');
      }
    });

    it('rejects proof with tampered hashes', async () => {
      const employee = employees[0];
      const proof = getProof(merkleTree, employee.publicKey);

      // Tamper with one hash in the proof
      proof[0][0] = (proof[0][0] + 1) % 256;

      try {
        await program.methods
          .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
          .accounts({ /* ... */ })
          .signers([employee])
          .rpc();

        expect.fail('Should have thrown error');
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal('NotAuthorized');
      }
    });
  });

  describe('Rate Limiting Attacks', () => {
    it('prevents spam market creation', async () => {
      const admin = anchor.web3.Keypair.generate();
      await grantAdminRole(company, admin.publicKey);

      // Create 50 markets (limit)
      for (let i = 0; i < 50; i++) {
        await createMarket(admin, company, i);
      }

      // Try to create 51st market
      try {
        await createMarket(admin, company, 51);
        expect.fail('Should have thrown error');
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal('RateLimitExceeded');
      }
    });

    it('rate limit resets after time window', async () => {
      const admin = anchor.web3.Keypair.generate();
      await grantAdminRole(company, admin.publicKey);

      // Create 50 markets
      for (let i = 0; i < 50; i++) {
        await createMarket(admin, company, i);
      }

      // Wait for rate limit window to expire (simulate time travel in devnet)
      // In production, use warp time or wait 1 hour

      // Should be able to create more markets
      await createMarket(admin, company, 51);
    });
  });

  describe('Pause Mechanism Attacks', () => {
    it('prevents market creation when paused', async () => {
      const admin = anchor.web3.Keypair.generate();
      await grantAdminRole(company, admin.publicKey);

      // Pause company
      await program.methods
        .togglePause()
        .accounts({ company: company, authority: companyAuthority.publicKey })
        .rpc();

      // Try to create market
      try {
        await createMarket(admin, company, 1);
        expect.fail('Should have thrown error');
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal('CompanyPaused');
      }
    });

    it('only company authority can pause', async () => {
      const attacker = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .togglePause()
          .accounts({ company: company, authority: attacker.publicKey })
          .signers([attacker])
          .rpc();

        expect.fail('Should have thrown error');
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal('Unauthorized');
      }
    });
  });
});
```

---

## 4. Gas Optimization Testing

### Compute Unit Benchmarks

```typescript
// tests/benchmarks/compute-units.test.ts
import { ComputeBudgetProgram } from '@solana/web3.js';

describe('Compute Unit Benchmarks', () => {
  it('measures register company CU usage', async () => {
    const tx = await program.methods
      .registerCompany(/* ... */)
      .transaction();

    const simulation = await provider.connection.simulateTransaction(tx);
    const unitsConsumed = simulation.value.unitsConsumed;

    console.log('Register Company CU:', unitsConsumed);
    expect(unitsConsumed).to.be.lessThan(20000); // Should be ~15k
  });

  it('measures create market CU usage', async () => {
    const tx = await program.methods.createMarket(/* ... */).transaction();

    const simulation = await provider.connection.simulateTransaction(tx);
    const unitsConsumed = simulation.value.unitsConsumed;

    console.log('Create Market CU:', unitsConsumed);
    expect(unitsConsumed).to.be.lessThan(40000); // Should be ~35k
  });

  it('measures place bet with merkle proof CU usage', async () => {
    const proof = getMerkleProof(merkleTree, employee.publicKey);

    const tx = await program.methods
      .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
      .transaction();

    const simulation = await provider.connection.simulateTransaction(tx);
    const unitsConsumed = simulation.value.unitsConsumed;

    console.log(`Place Bet (proof depth ${proof.length}) CU:`, unitsConsumed);

    // CU should scale with proof depth
    // depth 7 (~100 users): ~35k CU
    // depth 10 (~1000 users): ~40k CU
    // depth 20 (~1M users): ~55k CU
    expect(unitsConsumed).to.be.lessThan(60000);
  });

  it('compares admin vs employee betting CU', async () => {
    // Admin betting (no proof)
    const adminTx = await program.methods
      .placeBet(new anchor.BN(1_000_000_000), 0, null, null)
      .accounts({ adminRole: adminRolePDA })
      .transaction();

    const adminSim = await provider.connection.simulateTransaction(adminTx);
    const adminCU = adminSim.value.unitsConsumed;

    // Employee betting (with proof)
    const employeeTx = await program.methods
      .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
      .accounts({ adminRole: null })
      .transaction();

    const employeeSim = await provider.connection.simulateTransaction(employeeTx);
    const employeeCU = employeeSim.value.unitsConsumed;

    console.log('Admin betting CU:', adminCU);
    console.log('Employee betting CU:', employeeCU);

    // Employee should use more CU due to merkle verification
    expect(employeeCU).to.be.greaterThan(adminCU);
  });
});
```

---

## 5. Load Testing

### Stress Test Suite

```typescript
// tests/load/stress.test.ts
describe('Load Testing', () => {
  it('handles 1000 concurrent bets', async () => {
    const employees = Array.from({ length: 1000 }, () =>
      anchor.web3.Keypair.generate()
    );

    const { tree } = buildMerkleTree(employees.map(e => e.publicKey));

    // Create market
    const market = await createMarket(admin, company, 1);

    // Place 1000 bets concurrently
    const betPromises = employees.map(async (employee, i) => {
      const proof = getProof(tree, employee.publicKey);

      return program.methods
        .placeBet(new anchor.BN(1_000_000), i % 2, proof, new anchor.BN(1))
        .accounts({ market, company, user: employee.publicKey })
        .signers([employee])
        .rpc();
    });

    const startTime = Date.now();
    await Promise.all(betPromises);
    const endTime = Date.now();

    const throughput = 1000 / ((endTime - startTime) / 1000);
    console.log(`Throughput: ${throughput.toFixed(2)} bets/second`);

    expect(throughput).to.be.greaterThan(10); // At least 10 TPS
  });

  it('scales merkle proof verification to 1M users', async () => {
    // Simulate 1M user merkle tree (depth 20)
    const users = Array.from({ length: 1_000_000 }, (_, i) =>
      anchor.web3.Keypair.generate()
    );

    const { tree } = buildMerkleTree(users.map(u => u.publicKey));

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const proof = getProof(tree, randomUser.publicKey);

    console.log('Proof depth for 1M users:', proof.length);
    expect(proof.length).to.be.lessThanOrEqual(20);

    // Verify CU usage is acceptable
    const tx = await program.methods
      .placeBet(new anchor.BN(1_000_000_000), 0, proof, new anchor.BN(1))
      .transaction();

    const simulation = await provider.connection.simulateTransaction(tx);
    console.log('CU for 1M user proof:', simulation.value.unitsConsumed);

    expect(simulation.value.unitsConsumed).to.be.lessThan(100000);
  });
});
```

---

## 6. Pre-Deployment Checklist

### Critical Security Checks

- [ ] **PDA Derivation**: All PDAs use correct seeds and bump
- [ ] **Account Ownership**: All accounts verified with `constraint` or `has_one`
- [ ] **Signer Verification**: All state-changing instructions require proper signer
- [ ] **Role Verification**: Admin actions check admin role, employees check merkle proof
- [ ] **Cross-Company Isolation**: Markets/bets bound to correct company
- [ ] **Overflow Protection**: All arithmetic uses `checked_add`/`checked_sub`
- [ ] **Rate Limiting**: Critical operations have rate limits
- [ ] **Emergency Pause**: Pause mechanism tested and accessible
- [ ] **Merkle Proof Validation**: Proof depth limited, version checked
- [ ] **Account Size Limits**: All string fields have max length checks
- [ ] **No Hardcoded Secrets**: No private keys or secrets in code
- [ ] **Upgrade Authority**: Set correctly for mainnet

### Code Quality Checks

- [ ] **All tests passing**: 100% test coverage for critical paths
- [ ] **No compiler warnings**: `cargo build-bpf` runs clean
- [ ] **IDL generated**: Anchor IDL matches program
- [ ] **Gas optimized**: CU usage within budget for all operations
- [ ] **Documentation**: All public methods documented
- [ ] **Error messages**: All error codes have clear messages
- [ ] **Event emissions**: Critical state changes emit events

### Audit Requirements

- [ ] **Security audit**: External audit from reputable firm
- [ ] **Economic audit**: Tokenomics reviewed by economist
- [ ] **Bug bounty**: Public bug bounty program active
- [ ] **Testnet deployment**: Extensive testing on devnet/testnet
- [ ] **Multisig setup**: Upgrade authority uses multisig
- [ ] **Circuit breakers**: Pause mechanism and rate limits functional

---

## 7. Monitoring & Incident Response

### On-Chain Monitoring

```typescript
// monitoring/event-listener.ts
import { Program, web3 } from '@project-serum/anchor';

export class EventMonitor {
  constructor(private program: Program, private webhookUrl: string) {}

  async monitorEvents() {
    // Listen for suspicious activity
    this.program.addEventListener('AdminRoleGranted', (event, slot) => {
      this.checkAdminGrant(event);
    });

    this.program.addEventListener('MarketCreated', (event, slot) => {
      this.checkMarketCreation(event);
    });

    this.program.addEventListener('BetPlaced', (event, slot) => {
      this.checkBetActivity(event);
    });
  }

  private async checkAdminGrant(event: any) {
    // Alert if too many admins granted in short time
    const recentGrants = await this.getRecentAdminGrants();

    if (recentGrants.length > 10) {
      await this.sendAlert({
        severity: 'HIGH',
        message: `Unusual admin grant activity: ${recentGrants.length} grants in 1 hour`,
        details: event,
      });
    }
  }

  private async checkMarketCreation(event: any) {
    // Alert if market creation rate exceeds threshold
    // (should be prevented by on-chain rate limit, but double-check)
  }

  private async checkBetActivity(event: any) {
    // Alert if unusually large bets
    if (event.amount.toNumber() > 100_000_000_000) {
      // > 100 SOL
      await this.sendAlert({
        severity: 'MEDIUM',
        message: `Large bet detected: ${event.amount.toNumber() / 1e9} SOL`,
        details: event,
      });
    }
  }

  private async sendAlert(alert: any) {
    await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
  }
}
```

### Incident Response Runbook

#### Scenario 1: Admin Wallet Compromised

**Detection**: Unusual admin grants or market resolutions

**Response**:
1. Immediately pause company via `togglePause()`
2. Revoke compromised admin role via `revokeAdminRole()`
3. Investigate transaction history
4. Contact affected users
5. Deploy fixed merkle root excluding compromised wallet
6. Unpause after verification

#### Scenario 2: Merkle Root Corruption

**Detection**: Employees unable to bet, proof verification failures

**Response**:
1. Verify off-chain merkle tree matches on-chain root
2. If mismatch, regenerate tree from authoritative source
3. Update merkle root via `updateEmployeeMerkleRoot()`
4. Increment version to invalidate old proofs
5. Notify all employees to fetch new proofs

#### Scenario 3: Rate Limit Bypass

**Detection**: More markets created than rate limit allows

**Response**:
1. Review rate limit implementation
2. Check if multiple admins are creating markets (expected)
3. If single admin bypassing, pause company immediately
4. Deploy program upgrade fixing vulnerability
5. Revoke malicious admin

---

## Summary

This testing and security guide provides:

1. **Unit tests** for all core functionality
2. **Integration tests** for multi-company scenarios
3. **Security tests** simulating real attacks
4. **Benchmarks** for gas optimization
5. **Load tests** for scalability validation
6. **Deployment checklist** to prevent common mistakes
7. **Monitoring tools** for production operation

**Key Metrics to Track**:
- Test coverage: Aim for >95%
- Compute units: All operations <100k CU
- Throughput: >10 TPS sustained
- Gas costs: Match estimates in design doc
- Zero critical vulnerabilities in audit

**Before Mainnet**:
1. Complete all tests with 100% pass rate
2. External security audit (2+ firms)
3. 30+ days on testnet with real users
4. Bug bounty program (minimum $50k pool)
5. Multisig upgrade authority (3-of-5 minimum)
6. Incident response team on standby
