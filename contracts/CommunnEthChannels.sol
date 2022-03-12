// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract CommunnEthChannels {
    struct Channel {
        address owner; // creator
        string name; // Name
        string path; // waku topic format
    }

    mapping(string => Channel) channels;

    modifier channelExists(string memory path) {
        require(channels[path].owner != address(0), "Channel does not exist.");
        _;
    }

    modifier channelDoesNotExists(string memory path) {
        require(channels[path].owner == address(0), "Channel already exist.");
        _;
    }

    function createChannel(string memory name, string memory path)
        public
        channelDoesNotExists(path)
    {
        channels[path] = Channel(msg.sender, name, path);
    }

    function getChannelOwner(string memory path)
        public
        view
        channelExists(path)
        returns (address)
    {
        return channels[path].owner;
    }
}
