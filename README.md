# MileStack

Milestone-based programmable escrow platform powered by **FlowVault**.

This is a **skeleton only** — routes, components, and types are stubbed out with no business logic yet.

## Core flow (to be implemented)

1. Create a project
2. Define milestones
3. Deposit full budget into FlowVault
4. Lock funds
5. Release milestone-based payouts on completion
6. View vault state dashboard

## Structure

```
app/
  layout.tsx                  # root layout + Navbar
  page.tsx                    # home
  projects/
    page.tsx                  # project list / create entry point
    [id]/
      page.tsx                # project detail: deposit, lock, vault status
      milestones/
        page.tsx              # define milestones, release payouts
  vault/
    page.tsx                  # global vault state dashboard

components/
  Navbar.tsx
  WalletConnectButton.tsx     # @stacks/connect wallet auth
  ProjectCard.tsx
  MilestoneList.tsx
  MilestoneItem.tsx
  VaultStatus.tsx
  DepositForm.tsx
  LockFundsButton.tsx
  ReleasePayoutButton.tsx

lib/
  stacks.ts                   # @stacks/connect wrapper
  flowvault.ts                # flowvault-sdk wrapper
  constants.ts

types/
  project.ts
  milestone.ts
  vault.ts
```

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Stack

- Next.js (App Router) + TypeScript
- TailwindCSS
- `@stacks/connect` — wallet auth & tx signing
- `flowvault-sdk` — vault deposit / lock / release
