import { Container } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MessagesList from "../components/messages/MessagesList";
import NewMessage from "../components/messages/NewMessage";
import PageTitle from "../components/ui/PageTitle";
// import { useWakuMessagesHook } from "../hooks/WakuMessagesHook";

import { getSavedChannel } from "../utils/ChannelPersistance";

function Home(props) {
  const navigate = useNavigate();
  let messages = [
    {
      id: 1,
      sender: "0xB9638d21544809DaC95f00Aad1e9B1Cd3b07a260",
      timestamp: 12311,
      text: "Hi, today we will be discussing about the new pool.",
      type: "basic",
    },
    {
      id: 2,
      sender: "0xB9638d21544809DaC95f00Aad1e9B1Cd3b07a262",
      timestamp: 12312,
      text: "Ohhh, for real?",
      type: "basic",
    },
    {
      id: 3,
      sender: "0xB9638d21544809DaC95f00Aad1e9B1Cd3b07a263",
      timestamp: 12313,
      text: "Yup",
      type: "basic",
    },
    {
      id: 4,
      sender: "0xB9638d21544809DaC95f00Aad1e9B1Cd3b07a264",
      timestamp: 12314,
      text: "Great so what is it?",
      type: "basic",
    },
    {
      id: 5,
      sender: "0xB9638d21544809DaC95f00Aad1e9B1Cd3b07a264",
      timestamp: 12315,
      pollId: "koaskxaoqnoufpq123",
      text: "How do we proceed?",
      type: "poll",
      options: ["Buy it now", "Start recollect", "Pay from reserves"],
    },
  ];
  // let messages = useWakuMessagesHook(props.channel);

  useEffect(() => {
    if (getSavedChannel() === null) {
      navigate("/");
    }
  }, []);

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

        <PageTitle title={`Channel ${props.channel ?? "Test"}`} />
        <MessagesList messages={messages} />
        <NewMessage messages={messages} />
      </Box>
    </Container>
  );
}

export default Home;
