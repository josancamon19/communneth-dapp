import getWeb3 from "./getWeb3";
import CommunnEthChannelsContract from "./contracts/CommunnEthChannels.json";
import React, { Component } from "react";
import protons from "protons";
import { Waku, WakuMessage } from "js-waku";

import "./App.css";

const ContentTopic = `/communneth/1/test2/proto`;

const proto = protons(`
  message Message {
    string sender = 1;
    uint64 timestamp = 2;
    string text = 3;
    enum MessageType {
      BASIC = 0;
      PAYMENT = 1;
      POLL = 2;
      VOTE = 3;
    }
    MessageType messageType = 4; // type of poll
    optional uint64 amount = 5; // if type is payment

    // if type is create poll
    optional string question = 6;
    optional repeated string answers = 7;

    // if type is vote
    optional uint8 vote = 8; // idx arr votation
  }

  message PollInit {
    bytes owner = 1; // Address of a poll owner/initializer
    uint64 timestamp = 2; // Timestamp of a waku message
    string question = 3;// Question of a poll
    repeated string answers = 4; // Possible answers to poll
    enum PollType {
        WEIGHTED = 0;
        NON_WEIGHTED = 1;
    }
    PollType pollType = 5; // type of poll
    optional bytes minToken = 6; // amount of token needed for NON_WEIGHTED poll to be able to vote
    uint64 endTime = 7; // UNIX timestamp of poll end
    bytes signature = 8; // signature of all above fields
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
      amount: "0",
      messages: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAmountInputChange = this.handleAmountInputChange.bind(this);
    this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    this.handleMessageInputSubmit = this.handleMessageInputSubmit.bind(this);
    this.handlePayMessageInputSubmit =
      this.handlePayMessageInputSubmit.bind(this);
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
      this.initWaku();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

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
    const { text, timestamp, sender, messageType, amount } =
      proto.Message.decode(wakuMessage.payload);
    const message = { text, timestamp, sender, messageType, amount };
    this.state.messages = [message].concat(this.state.messages);
    console.log(this.state.messages);
  };

  wakuListenNewMessages = () => {
    this.state.waku.relay.addObserver(this.processWakuMessage, [ContentTopic]);
  };

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

  sendMessage = async () => {
    const payload = proto.Message.encode({
      timestamp: new Date().getTime(),
      text: this.state.message,
      sender: this.state.accounts[0],
      messageType: 0,
    });

    return WakuMessage.fromBytes(payload, ContentTopic).then((wakuMessage) =>
      this.state.waku.relay.send(wakuMessage)
    );
  };

  wakuCreatePaymentMessage = async () => {
    const payload = proto.Message.encode({
      timestamp: new Date().getTime(),
      text: this.state.message,
      sender: this.state.accounts[0],
      amount: this.state.web3.utils.toWei(this.state.amount, "ether"),
      messageType: 1,
    });

    return WakuMessage.fromBytes(payload, ContentTopic).then((wakuMessage) =>
      this.state.waku.relay.send(wakuMessage)
    );
  };

  wakuCreatePoll = async () => {
      // TODO poll is created in web3 then is sent in the message
      const payload = proto.Message.encode({
      timestamp: new Date().getTime(),
      sender: this.state.accounts[0],
      messageType: 3,
      text: "",
      question: "This is the question",
      answers: ["A", "B", "C", "D"],
    });

    return WakuMessage.fromBytes(payload, ContentTopic).then((wakuMessage) =>
      this.state.waku.relay.send(wakuMessage)
    );
  };

  wakuVotePoll = async () => {
    // TODO: does not use waku, but uses metamask
  };

  // ----------------------------------------------------------------
  // ---------------------- ETH Contract calls ----------------------

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

  isAccountOwner = async (channel) => {
    // detect if the address is the creator of the channel
    let addressOwner = await this.state.contract.methods
      .getChannelOwner(channel)
      .send({ from: this.state.accounts[0] });
    return addressOwner == this.state.accounts[0];
  };

  payAmountPaymentMessage = async (payMessage) => {
    await this.state.web3.eth.sendTransaction({
      from: this.state.accounts[0],
      to: payMessage.sender,
      value: payMessage.amount,
    });
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

  handleAmountInputChange(event) {
    this.setState({ amount: event.target.value });
  }

  handlePayMessageInputSubmit(event) {
    event.preventDefault();
    this.askPaymentWakuMessage();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <p>Waku Status: {this.state.wakuStatus}</p>
        {/* <PollButton theme={orangeTheme} account={this.state.accounts[0]} />  */}
        {/* signer={signer} */}
        {/* BASIC MESSAGE */}
        <form onSubmit={this.handleMessageInputSubmit}>
          <input
            type="text"
            value={this.state.message}
            onChange={this.handleMessageInputChange}
          />
          <input type="submit" value="Send message" />
        </form>
        {/* PAYMENT MESSAGE */}
        <form onSubmit={this.handlePayMessageInputSubmit}>
          <input
            type="text"
            value={this.state.message}
            onChange={this.handleMessageInputChange}
          />
          <input
            type="number"
            value={this.state.amount}
            onChange={this.handleAmountInputChange}
          />
          <input type="submit" value="Ask payment message" />
        </form>
        {/* CREATE CHANNEL CONTRACT OP */}
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
