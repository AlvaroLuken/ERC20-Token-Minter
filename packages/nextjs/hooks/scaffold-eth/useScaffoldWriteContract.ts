"use client";

import { useState } from "react";
import { Abi, ExtractAbiFunctionNames } from "abitype";
import { encodeFunctionData } from "viem";
import { UseWriteContractParameters } from "wagmi";
import { useAuth } from "~~/app/auth/AuthProvider";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import {
  ContractAbi,
  ContractName,
  ScaffoldWriteContractOptions,
  ScaffoldWriteContractVariables,
} from "~~/utils/scaffold-eth/contract";

// EDIT THIS FILE YO!!!!!!!!!

/**
 * this hook automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts
 * @param contractName - name of the contract to be written to
 */
export const useScaffoldWriteContract = <TContractName extends ContractName>(
  contractName: TContractName,
  writeContractParams?: UseWriteContractParameters,
) => {
  const { user } = useAuth();
  const [isMining, setIsMining] = useState(false);
  console.log(writeContractParams);

  const { data: deployedContractData } = useDeployedContractInfo(contractName);

  const sendContractWriteAsyncTx = async <
    TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">,
  >(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: ScaffoldWriteContractOptions,
  ) => {
    console.log("IN THE PLAYGROUND!");
    console.log(variables);

    if (!user) {
      notification.error("You must sign in to make a transaction.");
      return;
    }

    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      return;
    }

    try {
      console.log("HERE?");
      setIsMining(true);
      const { blockConfirmations, onBlockConfirmation, ...mutateOptions } = options || {};

      console.log(mutateOptions);
      console.log(blockConfirmations);
      console.log(onBlockConfirmation);
    } catch (e: any) {
      throw e;
    } finally {
      setIsMining(false);
    }
  };

  const sendContractWriteTx = <
    TContractName extends ContractName,
    TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">,
  >(
    variables: ScaffoldWriteContractVariables<TContractName, TFunctionName>,
    options?: Omit<ScaffoldWriteContractOptions, "onBlockConfirmation" | "blockConfirmations">,
  ) => {
    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      console.log(options);
      return;
    }

    const data = encodeFunctionData({
      abi: deployedContractData.abi as Abi,
      functionName: variables.functionName as string,
      args: variables.args as unknown[],
    });

    console.log(data);
  };

  return {
    isMining,
    writeContractAsync: sendContractWriteAsyncTx,
    writeContract: sendContractWriteTx,
  };
};
