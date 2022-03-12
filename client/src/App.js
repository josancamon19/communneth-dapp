import React, { Component } from "react";
import CommunnEthChannelsContract from "./contracts/CommunnEthChannels.json";
import getWeb3 from "./getWeb3";
// import { Waku } from "js-waku";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { web3: null, accounts: null, contract: null, channel: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createChannel = async () => {
    const { accounts, contract, channel } = this.state;
    const channelPath = `/communneth/1/${channel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;

    await contract.methods
      .createChannel(channel, channelPath)
      .send({ from: accounts[0] });
  };

  handleChange(event) {
    this.setState({ channel: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.createChannel();
  }

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


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.channel}
            onChange={this.handleChange}
          />
          <input type="submit" value="Create channel" />
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
