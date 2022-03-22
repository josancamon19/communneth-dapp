// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
pragma experimental ABIEncoderV2;

contract CommunEth {
    struct Channel {
        address owner; // creator
        string name; // Name
        string path; // waku topic format
        string password;
    }

    struct Poll {
        bytes32 id;
        string question;
        string[] answers;
        string channelPath;
        address creator;
    }

    // channelPath => x
    mapping(string => Channel) channels;
    // channelPath => (id => Poll)
    mapping(bytes32 => Poll) polls;
    mapping(bytes32 => mapping(address => uint8)) votes;

    event ChannelCreated(string path, string name, address owner);
    event PollCreated(bytes32 id, string question, address creator);

    modifier channelExists(string memory path) {
        require(channels[path].owner != address(0), "Channel does not exist.");
        _;
    }

    modifier channelDoesNotExists(string memory path) {
        require(channels[path].owner == address(0), "Channel already exist.");
        _;
    }

    function createChannel(
        string memory name,
        string memory path,
        string memory password
    ) public channelDoesNotExists(path) {
        channels[path] = Channel(msg.sender, name, path, password);
        emit ChannelCreated(path, name, msg.sender);
    }

    function createPoll(
        string memory path,
        string memory question,
        string[] memory answers
    ) public channelExists(path) {
        require(answers.length > 0, "Invalid answers length");

        bytes32 pollId = keccak256(
            abi.encodePacked(
                path,
                question,
                msg.sender,
                answers[0],
                block.timestamp
            )
        );

        Poll memory poll = Poll({
            id: pollId,
            question: question,
            answers: answers,
            channelPath: path,
            creator: msg.sender
        });

        polls[pollId] = poll;
        emit PollCreated(pollId, question, msg.sender);
    }

    function getPoll(bytes32 pollId) public view returns (Poll memory poll) {
        poll = polls[pollId];
    }

    function vote(bytes32 pollId, uint8 answer) public {
        // require(
        //     votes[pollId][msg.sender] != address(0),
        //     "Poll does not exists"
        // );
        votes[pollId][msg.sender] = answer;
    }

    function getChannelOwner(string memory path)
        public
        view
        channelExists(path)
        returns (address)
    {
        return channels[path].owner;
    }

    function matchesCredentials(string memory path, string memory password)
        public
        view
        channelExists(path)
        returns (bool)
    {
        require(bytes(password).length > 0, "Invalid password");
        return
            keccak256(bytes(password)) ==
            keccak256(bytes(channels[path].password));
    }
}
