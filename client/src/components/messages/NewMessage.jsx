import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { proto } from "../../utils/ProtoUtils";
import { WakuMessage } from "js-waku";

function NewMessage(props) {
  const [message, setMessage] = useState("");

  async function sendMessage() {
    const data = {
      timestamp: new Date().getTime(),
      text: message,
      sender: props.accounts[0],
      messageType: 0,
    };

    const payload = proto.Message.encode(data);
    const msg = await WakuMessage.fromBytes(payload, props.channel);
    await props.waku.relay.send(msg);
    props.wakuHistoryMessages();
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label="New message"
        variant="outlined"
        value={message}
        onChange={(e) => {
          e.preventDefault();
          setMessage(e.target.value);
        }}
      />
      <Button onClick={sendMessage} variant="contained">
        Send
      </Button>
    </>
  );
}

export default NewMessage;
