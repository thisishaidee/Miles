# MileStack

A milestone-based escrow platform powered by **FlowVault** on the **Stacks blockchain**.

MileStack enables clients to securely fund projects while ensuring contributors receive payments only after milestones are completed. By combining programmable escrow with transparent on-chain transactions, MileStack reduces payment disputes and builds trust between clients and contributors.

---

## The Problem

Traditional freelance and project payments often suffer from:

- Clients worried about paying before work is completed.
- Contributors worried about not getting paid after delivering work.
- Manual escrow processes.
- Lack of transparency.
- Payment disputes.

MileStack solves these problems through programmable on-chain escrow.

---

## Solution

Funds are deposited into FlowVault and locked on-chain.

Each project is divided into milestones.

When a milestone is completed and approved, its funds can be released directly from the escrow vault.

This creates a transparent payment workflow that benefits both clients and contributors.

---

## Features

- Secure escrow using FlowVault
- Milestone-based payments
- Wallet authentication
- Routing rule configuration
- On-chain deposits
- Vault balance tracking
- Milestone fund release
- Modern responsive interface

---

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- Stacks Connect
- FlowVault SDK
- Stacks Blockchain

---

## Project Workflow

1. Connect a Stacks wallet.
2. Create a project.
3. Add contributors.
4. Define milestones.
5. Configure FlowVault routing rules.
6. Deposit project funds.
7. Complete milestones.
8. Release milestone payments.

---

## Project Structure

```
app/
components/
lib/
types/
public/
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Start development

```bash
npm run dev
```

---

## Current Progress

- Project creation
- Milestone management
- Wallet connection
- FlowVault integration
- Routing rules
- Deposit workflow
- Vault state retrieval
- Milestone release
- Deposit flow debugging

---

## Future Improvements

- Multi-signature approvals
- Multiple escrow vaults
- Partial milestone payments
- Notifications
- Contributor dashboard
- Analytics
- Transaction history
- Mobile optimization
- Mainnet deployment

---

## Challenges

Building MileStack required integrating a new programmable escrow model while mapping milestone-based project management onto FlowVault's vault architecture.

Current work includes improving transaction reliability, debugging wallet interactions, and refining the deposit workflow.

---

## Why FlowVault?

FlowVault provides programmable money flows directly on Stacks, making it possible to:

- Lock funds securely
- Configure routing rules
- Release payments transparently
- Build trustless milestone payments

---

## Roadmap

### Phase 1
- Project creation
- Escrow deposits
- Wallet integration

### Phase 2
- Automated milestone releases
- Better dashboard
- Notifications

### Phase 3
- DAO approvals
- Team collaboration
- Cross-project management

---

## License

MIT License

---

## Author

Built by **Haidee**

Building secure payment infrastructure for freelancers, builders, and teams using the Stacks ecosystem.
