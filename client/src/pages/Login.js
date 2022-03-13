import getWeb3 from "../getWeb3";
import CommunEth from "../contracts/CommunEth.json";
import React from "react";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    const queryParams = new URLSearchParams(window.location.search);
    const channel = queryParams.get("channel");
    
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      channel: channel,
      createChannelModal: channel === null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(event) {
    this.setState({ channel: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.createChannel();
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

    this.state.channel = channelPath;
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
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
              value={this.state.channel}
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
}
export default LoginPage;
