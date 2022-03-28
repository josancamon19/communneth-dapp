export type Message = {
  sender: string;
  timestamp: number;
  text: string;
  messageType: number;
  options: [string];
};

export type MessageProps = {
  message: Message;
  isSender: Boolean;
};
