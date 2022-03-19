import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

function NewChannel(props) {
  const [newChannel, setNewChannel] = useState("");

  async function createChannel() {
    if (newChannel === "") return;

    const channelPath = `/communneth/1/${newChannel
      .toString()
      .replace(" ", "-")
      .toLowerCase()}/proto`;
    console.log(`Creating channel ${channelPath}`);

    await props.contract.methods
      .createChannel(newChannel, channelPath)
      .send({ from: props.accounts[0] });

    // this.setState({ channel: channelPath });
    // this.initWaku();
  }

  return (
    <div>
      <Typography variant="h3" component="h3">
        Create a channel
      </Typography>
      <TextField
        id="outlined-basic"
        label="Channel name"
        variant="outlined"
        value={newChannel}
        onChange={(e) => {
          e.preventDefault();
          setNewChannel(e.target.value);
        }}
      />
      <Button onClick={createChannel} variant="contained">
        Create
      </Button>
    </div>
  );
}

export default NewChannel;
