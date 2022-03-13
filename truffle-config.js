const path = require("path");
const HDWallet = require('@truffle/hdwallet-provider');
require('dotenv').config()

const infuraUrl = process.env.INFURA_URL;
const mnemonic = process.env.METAMASK_MNEMONIC;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWallet(mnemonic, infuraUrl);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    }
  }
};