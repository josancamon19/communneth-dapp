import React from "react";

import MessagesList from "../components/messages/MessagesList";
import NewMessage from "../components/messages/NewMessage";
import PageTitle from "../components/ui/PageTitle";
import { useWakuMessagesHook } from "../hooks/WakuMessagesHook";

function Home(props) {
  const messages = useWakuMessagesHook(props.channel);
  return (
    <>
      <PageTitle title={`Channel ${props.channel}`} />
      <MessagesList messages={messages} />
      <NewMessage messages={messages} />
    </>
  );
}

export default Home;
