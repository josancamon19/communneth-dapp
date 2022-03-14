import getWeb3 from "../getWeb3";
import CommunEth from "../contracts/CommunEth.json";
import React from "react";
import {
  Button,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Box } from "@mui/system";
import { Waku, WakuMessage } from "js-waku";
import protons from "protons";

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
    optional string pollId = 6;

    // if type is vote
    optional uint64 vote = 7; // idx arr votation
  }
`);
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    const queryParams = new URLSearchParams(window.location.search);
    const channel = queryParams.get("channel");

    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      newChannel: "",
      channel: channel === null ? "" : channel,
      createChannelModal: channel === null,
      waku: null,
      wakuStatus: "",
      message: "",
      messages: [],
    };

    if (channel !== null) {
      console.log(`Existing channel ${channel}`);
      this.initWaku();
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    this.handleMessageInputSubmit = this.handleMessageInputSubmit.bind(this);
  }

  async componentDidMount() {
    // TODO get channel query param
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CommunEth.networks[networkId];
      const instance = new web3.eth.Contract(
        CommunEth.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  createChannel = async () => {
    const { accounts, contract, newChannel } = this.state;
    const channelPath = `/communneth/1/${newChannel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;
    console.log(`Creating channel ${channelPath}`);

    await contract.methods
      .createChannel(newChannel, channelPath)
      .send({ from: accounts[0] });

    this.setState({ channel: channelPath });
    this.initWaku();
  };

  handleChange(event) {
    this.setState({ newChannel: event.target.value });
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

  initWaku = () => {
    Waku.create({ bootstrap: { default: true } }).then((waku) => {
      this.setState({ waku: waku });
      this.setState({ wakuStatus: "Connecting" });
      waku.waitForRemotePeer().then(() => {
        console.log(`Status ~ Ready`);
        this.setState({ wakuStatus: "Ready" });
        this.wakuListenNewMessages();
        this.wakuHistoryMessages();
      });
    });
  };

  processWakuMessage = (wakuMessage) => {
    console.log(`Processing message ${wakuMessage}`);
    if (!wakuMessage.payload) return;
    const { text, timestamp, sender, messageType, amount } =
      proto.Message.decode(wakuMessage.payload);
    const message = { text, timestamp, sender, messageType, amount };
    let alreadyExists = this.state.messages.find(
      (msg) =>
        msg.text === message.text &&
        msg.timestamp === message.timestamp &&
        msg.sender === message.sender
    );
    console.log(`Message exists ${alreadyExists}`);
    if (alreadyExists === null) {
      this.setState({ messages: [message].concat(this.state.messages) });
      console.log(this.state.messages);
    }
  };

  wakuListenNewMessages = () => {
    this.state.waku.relay.addObserver(this.processWakuMessage, [
      this.state.channel,
    ]);
    // `cleanUp` is called when the component is unmounted, see ReactJS doc.
    return function cleanUp() {
      this.state.waku.relay.deleteObserver(this.processWakuMessage, [
        this.state.channel,
      ]);
    };
  };

  wakuHistoryMessages = () => {
    // Load historic messages
    console.log(`Loading historic messages`);
    const callback = (retrievedMessages) => {
      // this.setState({ messages: [] });
      let messages = retrievedMessages
        .map(this.processWakuMessage) // Decode messages
        .filter(Boolean); // Filter out undefined values
    };
    this.state.waku.store
      .queryHistory([this.state.channel], { callback })
      .catch((e) => {
        console.log("Failed to retrieve messages from store", e);
      });
  };

  sendMessage = async () => {
    const data = {
      timestamp: new Date().getTime(),
      text: this.state.message,
      sender: this.state.accounts[0],
      messageType: 0,
    };
    console.log(data);
    console.log(`To ${this.state.channel}`);
    const payload = proto.Message.encode(data);

    const msg = await WakuMessage.fromBytes(payload, this.state.channel);
    await this.state.waku.relay.send(msg);
    this.wakuHistoryMessages();
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    if (this.state.channel === null || this.state.channel === "") {
      return (
        <div className="App">
          <Modal
            open={this.state.createChannelModal}
            onClose={() => {}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ mx: "auto", width: 200 }}>
              <Typography variant="h3" component="h3">
                Create a channel
              </Typography>
              <TextField
                id="outlined-basic"
                label="Channel name"
                variant="outlined"
                value={this.state.newChannel}
                onChange={this.handleChange}
              />
              <Button onClick={this.handleSubmit} variant="contained">
                Create
              </Button>
            </Box>
          </Modal>
        </div>
      );
    }
    let items = [];
    for (let i = 0; i < this.state.messages.length; i++) {
      const message = this.state.messages[i];
      items.push(
        <ListItem
          key={message.sender + message.timestamp}
          alignItems="flex-start"
        >
          <ListItemText
            primary={message.sender}
            secondary={<React.Fragment>{message.text}</React.Fragment>}
          />
        </ListItem>
      );
    }
    return (
      <div className="App">
        <>
          <Typography variant="h6" component="h6">
            Channel {this.state.channel}
          </Typography>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {items}
          </List>
          <TextField
            id="outlined-basic"
            label="New message"
            variant="outlined"
            value={this.state.message}
            onChange={this.handleMessageInputChange}
          />
          <Button onClick={this.handleMessageInputSubmit} variant="contained">
            Send
          </Button>
        </>
      </div>
    );
  }
}
export default LoginPage;
