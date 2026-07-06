import { FlowVault } from "flowvault-sdk";
import { request } from "@stacks/connect";
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
      console.log("========== FLOWVAULT DEBUG ==========");
  console.log("function:", params.functionName);
console.log("args:", params.functionArgs);
console.log("network:", params.network);
console.log("mode:", params.postConditionMode);
console.log("postConditions:", params.postConditions);
      console.log("====================================");

      return request("stx_callContract", {
        contract: `${params.contractAddress}.${params.contractName}`,
        functionName: params.functionName,
        functionArgs: params.functionArgs,
        network: params.network,
        postConditions: params.postConditions ?? [],
        postConditionMode:
          params.postConditionMode === "allow" ? "allow" : "deny",
      });
    },
  });
}
