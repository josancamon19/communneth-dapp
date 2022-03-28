import React, { useEffect, useState, createContext } from "react";

import CommunEth from "../contracts/CommunEth.json";
import getWeb3 from "../utils/getWeb3";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Eth } from "web3-eth";

const Web3Context = createContext({
  web3: null,
  contract: null,
  accounts: null,
});

type Props = {
  children: React.ReactNode;
};
export function Web3Provider({ children }: Props) {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  const context = {
    web3: web3,
    contract: contract,
    accounts: accounts,
  };

  async function setupWeb3() {
    const web3: Web3 = await getWeb3();
    const accounts: string[] = await web3.eth.getAccounts();
    const networkId: number = await web3.eth.net.getId();
    const deployedNetwork = CommunEth.networks[networkId];
    const instance = new web3.eth.Contract(
      CommunEth.abi,
      deployedNetwork && deployedNetwork.address
    );

    setWeb3(web3);
    setContract(instance);
    setAccounts(accounts);
  }

  useEffect(() => {
    setupWeb3();
  }, []);

  return (
    <Web3Context.Provider value={context}>{children}</Web3Context.Provider>
  );
}

export default Web3Context;
