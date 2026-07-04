// App-wide constants (network config, contract identifiers, etc.)

/**
 * MileStack currently only supports Stacks Testnet.
 * Testnet STX addresses are encoded with the "ST" prefix,
 * mainnet addresses with "SP" — this is used to guard
 * against accidentally connecting a mainnet wallet.
 */
export const STACKS_NETWORK = "testnet" as const;

export const TESTNET_ADDRESS_PREFIX = "ST";

/**
 * FlowVault escrow contract (Stacks Testnet).
 */
export const FLOWVAULT_CONTRACT_ADDRESS =
  "STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD";
export const FLOWVAULT_CONTRACT_NAME = "flowvault-v2";

/**
 * USDCx SIP-010 token used for deposits / payouts (Stacks Testnet).
 */
export const USDCX_TOKEN_CONTRACT_ADDRESS =
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const USDCX_TOKEN_CONTRACT_NAME = "usdcx";

/**
 * Hiro-hosted Stacks Testnet API, used for lightweight reads that don't
 * go through @stacks/connect (e.g. fetching the current chain tip).
 */
export const STACKS_API_URL = "https://api.testnet.hiro.so";

