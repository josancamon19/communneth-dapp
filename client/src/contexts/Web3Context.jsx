import React, { useEffect, useState, createContext } from "react";

import CommunEth from "../contracts/CommunEth.json";
import getWeb3 from "../utils/getWeb3";

const Web3Context = createContext({
  web3: null,
  contract: null,
  accounts: null,
});

export function Web3Provider(props) {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const context = {
    web3: web3,
    contract: contract,
    accounts: accounts,
  };

  async function setupWeb3() {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
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
    <Web3Context.Provider value={context}>
      {props.children}
    </Web3Context.Provider>
  );
}

export default Web3Context;
