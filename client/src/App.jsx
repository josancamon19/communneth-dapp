import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewChannel from "./pages/NewChannel";
import React, { useEffect, useState } from "react";
import { Waku } from "js-waku";
import CommunEth from "./contracts/CommunEth.json";
import getWeb3 from "./getWeb3";
import Login from "./pages/Login";

function App() {
  const [waku, setWaku] = useState(null);
  const [status, setStatus] = useState("");

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    try {
      getWeb3().then((web3) => {
        setWeb3(web3);
        web3.eth.getAccounts().then(setAccounts);

        web3.eth.net.getId().then((networkId) => {
          const deployedNetwork = CommunEth.networks[networkId];
          const instance = new web3.eth.Contract(
            CommunEth.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(instance);
        });
      });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  });

  useEffect(() => {
    Waku.create({ bootstrap: { default: true } }).then(async (waku) => {
      setWaku(waku);
      setStatus("Connecting");

      await waku.waitForRemotePeer();
      setStatus("Ready");
      console.log(`Status ~ Ready`);

      // this.wakuListenNewMessages();
      // this.wakuHistoryMessages();
    });
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={Login} />
        <Route path="/new-channel" element={NewChannel} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
