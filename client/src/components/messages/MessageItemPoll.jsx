import { List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

function MessageItemPoll(props) {
  const options = props.message.options.map((item) => {
    return (
      <ListItem alignItems="flex-start" key={item} onClick={()=>{
        console.log(`Click ${item}`);
        // TODO execute tx for saving response
      }}>
        <Typography sx={{ marginTop: -1 }}>{item}</Typography>
      </ListItem>
    );
  });
  return (
    <>
      <ListItem
        key={props.message.sender + props.message.timestamp}
        alignItems="flex-start"
      >
        <ListItemText
          primary={`${props.message.sender.substring(0, 10)}`}
          secondary={
            <React.Fragment>{`New Poll: ${props.message.text}`}</React.Fragment>
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
