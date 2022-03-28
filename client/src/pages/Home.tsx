import { Container, Grid, Link } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MessagesList from "../components/messages/MessagesList";
import NewMessage from "../components/messages/NewMessage";
import PageTitle from "../components/ui/PageTitle";
import { useWakuMessagesHook } from "../hooks/WakuMessagesHook";

import {
  getSavedChannel,
  removeSavedChannel,
} from "../utils/ChannelPersistance";

// type Props = {
//   channel: string;
// };

function Home() {
  // { channel }: Props
  const navigate = useNavigate();
  let messages = useWakuMessagesHook();

  useEffect(() => {
    if (getSavedChannel() === null) {
      navigate("/");
    }
    //eslint-disable-next-line
  }, []);
  const channel = getSavedChannel();
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PageTitle title={`Channel ${channel ?? "Test"}`} />
        <MessagesList messagesData={messages} />
        <NewMessage />
        <Grid container>
          <Grid item xs>
            <Link
              // href="/"
              variant="body2"
              onClick={() => {
                // remove store channel
                removeSavedChannel();
                // go back home
                navigate("/");
              }}
              sx={{
                marginTop: 4,
                color: "red",
                marginBottom: 4,
              }}
            >
              Logout
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;
