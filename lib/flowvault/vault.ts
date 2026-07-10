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

    contractCallExecutor: async (call) => {
      return request("stx_callContract", {
        contract: `${call.contractAddress}.${call.contractName}`,
        functionName: call.functionName,
        functionArgs: call.functionArgs,
        network: call.network,
        postConditionMode:
          String(call.postConditionMode ?? "allow")
            .toLowerCase()
            .includes("deny")
            ? "deny"
            : "allow",
        postConditions: call.postConditions,
      });
    },
  });
}
