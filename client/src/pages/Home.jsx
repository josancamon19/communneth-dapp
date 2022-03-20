import React, { useEffect, useState } from "react";

import MessagesList from "../components/messages/MessagesList";
import NewMessage from "../components/messages/NewMessage";
import PageTitle from "../components/ui/PageTitle";
import { proto } from "../utils/ProtoUtils";

function Home(props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    wakuHistoryMessages();
  });

  function wakuHistoryMessages() {
    console.log(`Loading historic messages`);
    const callback = (retrievedMessages) => {
      // let messages =
      retrievedMessages.map(processWakuMessage).filter(Boolean);
    };
    props.waku.store.queryHistory([props.channel], { callback }).catch((e) => {
      console.log("Failed to retrieve messages from store", e);
    });
  }

  function processWakuMessage(wakuMessage) {
    if (!wakuMessage.payload) return;

    const { text, timestamp, sender, messageType, amount } =
      proto.Message.decode(wakuMessage.payload);

    let alreadyExists = messages.find(
      (msg) =>
        msg.text === text &&
        msg.timestamp === timestamp &&
        msg.sender === sender
    );

    console.log(`Message exists ${alreadyExists}`);

    const message = { text, timestamp, sender, messageType, amount };
    if (alreadyExists === null) {
      setMessages((prev) => [message].concat(prev));
    }
  }

  useEffect(() => {
    props.waku.relay.addObserver(processWakuMessage, [props.channel]);
    return function cleanUp() {
      props.waku.relay.deleteObserver(processWakuMessage, [props.channel]);
    };
  }, [props.channel]);

  return (
    <div>
      <PageTitle title={`Channel ${props.channel}`} />
      <MessagesList messages={messages} />
      <NewMessage messages={messages} />
    </div>
  );
}

export default Home;
