export interface VaultState {
  totalDeposited: number;
  lockedBalance: number;
  availableBalance: number;
  releasedBalance: number;
  txHash?: string;
}
