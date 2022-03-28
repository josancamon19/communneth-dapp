import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ShareRounded from "@mui/icons-material/ShareRounded";
import { getSavedChannel } from "../../utils/ChannelPersistance";

type Props = {
  title: string;
};
function PageTitle({ title }: Props) {
  return (
    <Box
      component="div"
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" component="h6">
        {title}
      </Typography>
      {/* How to add margin here? */}
      <Button
        endIcon={<ShareRounded />}
        size="small"
        sx={{}}
        onClick={(e) => {
          e.preventDefault();
          const channel = getSavedChannel();
          console.log(`Sharing ${channel}`);
          
          // TODO do whatsapp open for sending channel link to user
          // URL?
        }}
      >
        Invite to chat
      </Button>
    </Box>
  );
}

export default PageTitle;
