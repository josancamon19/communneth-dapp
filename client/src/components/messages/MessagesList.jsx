import { Container, List } from "@mui/material";
import React from "react";
import MessageItem from "./MessageItem";
import MessageItemPoll from "./MessageItemPoll";

function MessagesList(props) {
  const messages = props.messages.map((message) =>
    message.messageType === 0 ? (
      <MessageItem message={message} key={message.sender + message.timestamp} />
    ) : message.messageType === 0 ? (
      <MessageItemPoll
        message={message}
        key={message.sender + message.timestamp}
      />
    ) : (
      <Container />
    )
  );
  messages.reverse();
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {messages}
    </List>
  );
}

export default MessagesList;
