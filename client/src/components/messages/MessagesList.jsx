import { List } from "@mui/material";
import React from "react";
import MessageItem from "./MessageItem";
import MessageItemPoll from "./MessageItemPoll";

function MessagesList(props) {
  const messages = props.messages.map((message) =>
    message.type === "basic" ? (
      <MessageItem message={message} key={message.id} />
    ) : (
      <MessageItemPoll message={message} key={message.id} />
    )
  );
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {messages}
    </List>
  );
}

export default MessagesList;
