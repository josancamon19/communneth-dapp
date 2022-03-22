import { ListItem, ListItemText } from "@mui/material";
import React from "react";

function MessageItem(props) {
  return (
    <React.Fragment>
      <ListItem
        key={props.message.sender + props.message.timestamp}
        alignItems="flex-start"
      >
        <ListItemText
          primary={`${props.message.sender.substring(0, 10)}`}
          secondary={<React.Fragment>{props.message.text}</React.Fragment>}
        />
      </ListItem>
    </React.Fragment>
  );
}

export default MessageItem;
