import React, { useEffect, useState, createContext } from "react";

import CommunEth from "../contracts/CommunEth.json";
import getWeb3 from "../utils/getWeb3";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

const Web3Context = createContext({
  web3: {} as Web3,
  contract: {} as Contract,
  accounts: [] as string[],
});

type Props = {
  children: React.ReactNode;
};
export function Web3Provider({ children }: Props) {
  const [web3, setWeb3] = useState<Web3>({} as Web3);
  const [contract, setContract] = useState<Contract>({} as Contract);
  const [accounts, setAccounts] = useState<string[]>([] as string[]);

  const context = {
    web3: web3,
    contract: contract,
    accounts: accounts,
  };

  async function setupWeb3() {
    const web3: Web3 = await getWeb3();
    const accounts: string[] = await web3.eth.getAccounts();
    const networkId: number = await web3.eth.net.getId();
    const deployedNetwork = (CommunEth as any).networks[networkId];
    const instance = new web3.eth.Contract(
      (CommunEth as any).abi,
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
