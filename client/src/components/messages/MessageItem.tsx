import { Box, Container, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { MessageProps } from "../../models/Messages";

function MessageItem({ message, isSender }: MessageProps) {
  return (
    <Container>
      <Box
        sx={{
          maxWidth: "80%",
          display: "flex",
          backgroundColor: "#03A9F4",
          flexWrap: "wrap",
          marginTop: 1,
          borderRadius: "8px",
        }}
      >
        <ListItem
          key={message.sender + message.timestamp}
          alignItems={isSender ? "center" : "flex-start"}
          // alignItems={
          //   props.message.sender == props.web3Account
          //     ? "flex-end"
          //     : "flex-start"
          // }
        >
          {/* 
        TODO: Improve styling
          - Set sender to bold
          - Sender address to 10 length
          - How long messages look like?
          - Send images through messages? 🤔 
          - Message box wrapper 
          - Time formatted to the right end in a kind of grey
        */}
          <ListItemText
            primary={`${message.sender.substring(0, 10)}`}
            primaryTypographyProps={{
              fontWeight: "600",
            }}
            sx={{
              flexWrap: "wrap",
              alignContent: "flex-end",
            }}
            secondary={<React.Fragment>{message.text}</React.Fragment>}
          />
        </ListItem>
      </Box>
    </Container>
  );
}

export default MessageItem;
