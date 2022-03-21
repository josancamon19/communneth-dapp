import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../contexts/Web3Context";
import { Button, TextField, Typography, Container } from "@mui/material";
import { Box } from "@mui/system";

function NewChannel(props) {
  const [newChannel, setNewChannel] = useState("");
  const [password, setPassword] = useState("");

  const web3Context = useContext(Web3Context);

  useEffect(() => {
    if (web3Context.contract === null) return;
    web3Context.contract.events.ChannelCreated().on("data", (event) => {
      const data = event.returnValues;
      console.log(data);
      console.log(newChannel);
      if (data.name === newChannel) {
        console.log(`Channel created -> send me to home`);
      }
    });
  }, [web3Context.contract]);

  async function createChannel() {
    if (newChannel === "") return;

    const channelPath = `/communneth/1/${newChannel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;

    console.log(`Creating channel ${channelPath}`);
    await web3Context.contract.methods
      .createChannel(newChannel, channelPath)
      .send({ from: web3Context.accounts[0] });

    setNewChannel("");
    
    // TODO: show waiting for completion
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="h1">
          Create a channel
        </Typography>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            createChannel();
          }}
          noValidate
          sx={{ mt: 3 }}
        >
          <TextField
            id="outlined-basic"
            label="Channel name"
            variant="outlined"
            value={newChannel}
            required
            fullWidth
            onChange={(e) => {
              e.preventDefault();
              setNewChannel(e.target.value);
            }}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default NewChannel;
