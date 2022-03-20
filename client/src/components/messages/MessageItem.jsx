import { ListItem, ListItemText } from "@mui/material";
import React from "react";

function MessageItem(props) {
  return (
    <>
      <ListItem
        key={props.message.sender + props.message.timestamp}
        alignItems="flex-start"
      >
        <ListItemText
          primary={props.message.sender}
          secondary={<React.Fragment>{props.message.text}</React.Fragment>}
        />
      </ListItem>
    </>
  );
}

export default MessageItem;
