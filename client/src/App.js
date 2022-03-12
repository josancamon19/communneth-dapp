import React, { Component } from "react";
import CommunnEthChannelsContract from "./contracts/CommunnEthChannels.json";
import getWeb3 from "./getWeb3";
import { Waku } from "js-waku";

import "./App.css";

class App extends Component {
  zż;
  state = { web3: null, accounts: null, contract: null, newChannel: "" };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CommunnEthChannelsContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CommunnEthChannelsContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  createChannel = async () => {
    const { accounts, contract, newChannel } = this.state;
    const channelPath = `/communneth/1/${newChannel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;

    await contract.methods
      .createChannel(newChannel, channelPath)
      .send({ from: accounts[0] });
  };

  setNewChannel = (event) => {
    event.preventDefault();
    const channelName = event.target.value;
    console.log(channelName);
    this.state.newChannel = channelName;
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <form action="submit">
          <input
            type="text"
            value={this.state.newChannel}
            onChange={this.setNewChannel}
          />
          <input
            type="button"
            value="Create channel"
            onSubmit={this.createChannel}
          />
        </form>
      </div>
    );
  }
}

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   componentDidMount() {
//     Waku.create({ bootstrap: { default: true } }).then(async (waku) => {
//       const wakuMessage = await WakuMessage.fromUtf8String(
//         "Here is a message",
//         `/relay-guide/1/chat/proto`
//       );
//       await waku.relay.send(wakuMessage);
//     });
//     this.state.messages = [];
//     const fakeMessages = ["Message 1", "Message2"];
//     for (let index = 0; index < fakeMessages.length; index++) {
//       const element = fakeMessages[index];
//       this.state.messages.push(<li key={element}>{element}</li>);
//     }
//   }

//   render() {
//     return (
//       <div className="App">
//         <ul>{this.state.messages}</ul>
//         <>
//           <form method>
//             <input type="text" />
//             <input type="button" value="Send message" className="" />
//           </form>
//         </>
//       </div>
//     );
//   }
// }

export default App;
