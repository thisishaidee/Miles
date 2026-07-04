export type MilestoneStatus = "pending" | "completed" | "released";

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  contributorWallet: string;
  status: MilestoneStatus;
}
