import { FlowVault } from "flowvault-sdk";
import {
  STACKS_NETWORK,
  FLOWVAULT_CONTRACT_ADDRESS,
  FLOWVAULT_CONTRACT_NAME,
  USDCX_TOKEN_CONTRACT_ADDRESS,
  USDCX_TOKEN_CONTRACT_NAME,
} from "@/lib/constants";
import { getUserAddress } from "@/lib/stacks";

export function getFlowVault(): FlowVault {
  const senderAddress = getUserAddress();

  if (!senderAddress) {
    throw new Error(
      "No connected wallet. Connect a Stacks wallet before creating a FlowVault instance."
    );
  }

  return new FlowVault({
    network: STACKS_NETWORK,
    contractAddress: FLOWVAULT_CONTRACT_ADDRESS,
    contractName: FLOWVAULT_CONTRACT_NAME,
    tokenContractAddress: USDCX_TOKEN_CONTRACT_ADDRESS,
    tokenContractName: USDCX_TOKEN_CONTRACT_NAME,
    senderAddress,

    contractCallExecutor: async (params) => {
      alert("STEP A");

      alert("Params type: " + typeof params);

      try {
        alert("Params value: " + JSON.stringify(params));
      } catch (e) {
        alert("Could not stringify params");
      }

      return {
        txId: "debug",
      } as any;
    },
  });
}
