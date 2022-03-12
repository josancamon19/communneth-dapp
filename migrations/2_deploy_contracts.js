var CommunnEthChannels = artifacts.require("./CommunnEthChannels.sol");

module.exports = function(deployer) {
  deployer.deploy(CommunnEthChannels);
};
