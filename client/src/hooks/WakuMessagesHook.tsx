import { WakuMessage } from "js-waku";
import { useContext, useEffect, useState } from "react";
import WakuContext from "../contexts/WakuContext";
import { Message } from "../models/Messages";
import { getSavedChannel } from "../utils/ChannelPersistance";
import { proto } from "../utils/ProtoUtils";

export function useWakuMessagesHook(): Message[] {
  const [messages, setMessages] = useState<Message[]>([]);
  const wakuContext = useContext(WakuContext);

  const channel = getSavedChannel();

  useEffect(() => {
    if (wakuContext.waku.store === undefined) return;
    wakuHistoryMessages();
    // eslint-disable-next-line
  }, [wakuContext.waku]);

  useEffect(() => {
    if (wakuContext.waku.relay === undefined) return;
    wakuContext.waku.relay.addObserver(processWakuMessage, [channel as string]);
    return function cleanUp() {
      wakuContext.waku.relay.deleteObserver(processWakuMessage, [
        channel as string,
      ]);
    };
    // eslint-disable-next-line
  }, [wakuContext.waku, channel]);

  function wakuHistoryMessages() {
    const callback = (retrievedMessages: WakuMessage[]): boolean | void => {
      // let messages =
      retrievedMessages.map(processWakuMessage).filter(Boolean);
    };
    wakuContext.waku.store
      .queryHistory([channel as string], { callback })
      .catch((e: Error) => {
        console.log("Failed to retrieve messages from store", e);
      });
  }

  function processWakuMessage(wakuMessage: WakuMessage) {
    if (!wakuMessage.payload) return;

    const { text, timestamp, sender, messageType } = proto.Message.decode(
      wakuMessage.payload
    );

    let alreadyExists = messages.find(
      (msg) =>
        msg.text === text &&
        msg.timestamp === timestamp &&
        msg.sender === sender
    );

    const message = { text, timestamp, sender, messageType };
    if (alreadyExists === undefined) {
      setMessages((prev) => [message as Message].concat(prev));
    }
  }

  return messages;
}
