import React, { Component } from "react";
import CommunnEthChannelsContract from "./contracts/CommunnEthChannels.json";
import getWeb3 from "./getWeb3";
import { Waku, WakuMessage } from "js-waku";
import protons from "protons";

import "./App.css";

const ContentTopic = `/communneth/1/conjuntoloscerezos/proto`;

const proto = protons(`
message SimpleChatMessage {
  string sender = 1;
  uint64 timestamp = 2;
  string text = 3;
}
`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      channel: "",
      waku: null,
      wakuStatus: "",
      message: "",
      messages: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    this.handleMessageInputSubmit = this.handleMessageInputSubmit.bind(this);
  }

  initWaku = () => {
    Waku.create({ bootstrap: { default: true } }).then((waku) => {
      this.setState({ waku: waku });
      this.setState({ wakuStatus: "Connecting" });
      waku.waitForRemotePeer().then(() => {
        this.setState({ wakuStatus: "Ready" });
        this.wakuListenNewMessages();
        this.wakuHistoryMessages();
      });
    });
  };

  processWakuMessage = (wakuMessage) => {
    if (!wakuMessage.payload) return;
    const { text, timestamp, sender } = proto.SimpleChatMessage.decode(
      wakuMessage.payload
    );
    const message = { text, timestamp, sender };
    this.state.messages = [message].concat(this.state.messages);
    console.log(this.state.messages);
  };

  wakuListenNewMessages = () => {
    this.state.waku.relay.addObserver(this.processWakuMessage, [ContentTopic]);
  }

  wakuHistoryMessages = () => {

    // Load historic messages
    const callback = (retrievedMessages) => {
      const historicalMessages = retrievedMessages
        .map(this.processWakuMessage) // Decode messages
        .filter(Boolean); // Filter out undefined values

    };

    this.state.waku.store
      .queryHistory([ContentTopic], { callback })
      .catch((e) => {
        // Catch any potential error
        console.log("Failed to retrieve messages from store", e);
      });

    // `cleanUp` is called when the component is unmounted, see ReactJS doc.
    return function cleanUp() {
      this.state.waku.relay.deleteObserver(this.processWakuMessage, [
        ContentTopic,
      ]);
    };
  };

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

  handleMessageInputChange(event) {
    this.setState({ message: event.target.value });
  }

  handleMessageInputSubmit(event) {
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage = async () => {
    const payload = proto.SimpleChatMessage.encode({
      timestamp: new Date().getTime(),
      text: this.state.message,
      sender: this.state.accounts[0],
    });

    return WakuMessage.fromBytes(payload, ContentTopic).then((wakuMessage) =>
      this.state.waku.relay.send(wakuMessage)
    );
  };

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
      this.initWaku();
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
        <p>Waku Status: {this.state.wakuStatus}</p>
        <form onSubmit={this.handleMessageInputSubmit}>
          <input
            type="text"
            value={this.state.message}
            onChange={this.handleMessageInputChange}
          />
          <input type="submit" value="Send message" />
        </form>
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
