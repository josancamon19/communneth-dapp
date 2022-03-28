import { Container, List } from "@mui/material";
import React, { useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import { Message } from "../../models/Messages";
import MessageItem from "./MessageItem";
import MessageItemPoll from "./MessageItemPoll";

type Props = {
  messagesData: [Message];
};

function MessagesList({ messagesData }: Props) {
  const web3Context = useContext(Web3Context);

  const messages = messagesData.map((message) => {
    const isSender = web3Context.accounts[0] === message.sender;
    const key = message.sender + message.timestamp;
    return message.messageType === 0 ? (
      <MessageItem message={message} key={key} isSender={isSender} />
    ) : message.messageType === 1 ? (
      <MessageItemPoll key={key} message={message} isSender={isSender} />
    ) : (
      <Container />
    );
  });
  messages.reverse();
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      {messages}
    </List>
  );
}

export default MessagesList;
