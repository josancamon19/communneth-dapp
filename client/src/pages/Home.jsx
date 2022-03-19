import { useEffect } from "react";
import MessagesList from "../components/messages/MessagesList";
import NewMessage from "../components/messages/NewMessage";
import PageTitle from "../components/ui/PageTitle";

function Home(props) {
  const [messages, setMessages] = useState([]);

  function wakuHistoryMessages() {
    // Load historic messages
    console.log(`Loading historic messages`);
    const callback = (retrievedMessages) => {
      // this.setState({ messages: [] });
      // let messages =
      retrievedMessages
        .map(this.processWakuMessage) // Decode messages
        .filter(Boolean); // Filter out undefined values
    };
    this.state.waku.store
      .queryHistory([props.channel], { callback })
      .catch((e) => {
        console.log("Failed to retrieve messages from store", e);
      });
  }

  processWakuMessage = (wakuMessage) => {
    console.log(`Processing message ${wakuMessage}`);
    if (!wakuMessage.payload) return;
    const { text, timestamp, sender, messageType, amount } =
      proto.Message.decode(wakuMessage.payload);
    const message = { text, timestamp, sender, messageType, amount };
    let alreadyExists = this.state.messages.find(
      (msg) =>
        msg.text === message.text &&
        msg.timestamp === message.timestamp &&
        msg.sender === message.sender
    );
    console.log(`Message exists ${alreadyExists}`);
    if (alreadyExists === null) {
      this.setState({ messages: [message].concat(this.state.messages) });
      console.log(this.state.messages);
    }
  };

  useEffect(() => {
    this.state.waku.relay.addObserver(this.processWakuMessage, [props.channel]);
    return function cleanUp() {
      this.state.waku.relay.deleteObserver(this.processWakuMessage, [
        this.state.channel,
      ]);
    };
  });

  return (
    <div>
      <PageTitle title={`Channel ${props.channel}`} />
      <MessagesList messages={messages} />
      <NewMessage messages={messages} />
    </div>
  );
}

export default Home;
