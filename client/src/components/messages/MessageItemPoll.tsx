import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { Message, MessageProps } from "../../models/Messages";

function MessageItemPoll({ message, isSender }: MessageProps) {
  const options = message.options.map((item: string) => {
    return (
      <ListItem
        alignItems="flex-start"
        key={item}
        onClick={() => {
          console.log(`Click ${item}`);
          // TODO execute tx for saving response
        }}
      >
        <Typography sx={{ marginTop: -1 }}>{item}</Typography>
      </ListItem>
    );
  });
  return (
    <>
      <ListItem
        key={message.sender + message.timestamp}
        alignItems="flex-start"
      >
        <ListItemText
          primary={`${message.sender.substring(0, 10)}`}
          secondary={
            <React.Fragment>{`New Poll: ${message.text}`}</React.Fragment>
          }
        />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {options}
        </List>
      </ListItem>
    </>
  );
}

export default MessageItemPoll;
