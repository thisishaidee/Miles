import type { Milestone } from "@/types/milestone";

export interface Project {
  id: string;
  name: string;
  totalBudget: number;
  clientWallet: string;
  milestones: Milestone[];
  vaultBalance: number;
  releasedBalance: number;
  createdAt: string;
}
