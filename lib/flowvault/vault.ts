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
     alert("FLOWVAULT DEBUG");
alert("Function: " + params.functionName);
alert("Mode: " + params.postConditionMode);
alert("Post conditions: " + JSON.stringify(params.postConditions));

   const payload = {
  contract: `${params.contractAddress}.${params.contractName}`,
  functionName: params.functionName,
  functionArgs: params.functionArgs,
  network: params.network,
  postConditions: params.postConditions ?? [],
  postConditionMode:
    params.postConditionMode === "allow" ? "allow" : "deny",
};

console.log("========== WALLET PAYLOAD ==========");
console.log(payload);
console.log("====================================");

return request("stx_callContract", payload);
    },
  });
}
