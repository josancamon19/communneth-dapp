import { useContext, useEffect, useState } from "react";
import WakuContext from "../contexts/WakuContext";
import { getSavedChannel } from "../utils/ChannelPersistance";
import { proto } from "../utils/ProtoUtils";

export function useWakuMessagesHook() {
  const [messages, setMessages] = useState([]);
  const wakuContext = useContext(WakuContext);

  const channel = getSavedChannel();

  useEffect(() => {
    if (wakuContext.waku === null) return;
    wakuHistoryMessages();
  }, [wakuContext.waku]);

  useEffect(() => {
    if (wakuContext.waku === null) return;
    wakuContext.waku.relay.addObserver(processWakuMessage, [channel]);
    return function cleanUp() {
      wakuContext.waku.relay.deleteObserver(processWakuMessage, [channel]);
    };
  }, [wakuContext.waku, channel]);

  function wakuHistoryMessages() {
    const callback = (retrievedMessages) => {
      // let messages =
      retrievedMessages.map(processWakuMessage).filter(Boolean);
    };
    wakuContext.waku.store.queryHistory([channel], { callback }).catch((e) => {
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

    const message = { text, timestamp, sender, messageType, amount };
    if (alreadyExists === undefined) {
      setMessages((prev) => [message].concat(prev));
    }
  }

  return [messages, wakuHistoryMessages];
}
