import protons from "protons";

export const proto = protons(`
    message Message {
    string sender = 1;
    uint64 timestamp = 2;
    string text = 3;
    enum MessageType {
        BASIC = 0;
        PAYMENT = 1;
        POLL = 2;
        VOTE = 3;
    }
    MessageType messageType = 4; // type of poll
    optional uint64 amount = 5; // if type is payment

    // if type is create poll
    optional string pollId = 6;

    // if type is vote
    optional uint64 vote = 7; // idx arr votation
    }
`);
