import { useEffect, useState } from "react";
import { proto } from "../utils/ProtoUtils";

export function useWakuMessagesHook(waku, channel) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    wakuHistoryMessages();
  });

  function wakuHistoryMessages() {
    const callback = (retrievedMessages) => {
      // let messages =
      retrievedMessages.map(processWakuMessage).filter(Boolean);
    };
    waku.store.queryHistory([channel], { callback }).catch((e) => {
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
    waku.relay.addObserver(processWakuMessage, [channel]);
    return function cleanUp() {
      waku.relay.deleteObserver(processWakuMessage, [channel]);
    };
    // eslint-disable-next-line
  }, [channel]);

  return messages;
}
