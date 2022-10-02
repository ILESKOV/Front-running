const { ethers } = require("ethers");

require("dotenv").config();

const url = `https://eth-mainnet.alchemyapi.io/v2/${process.env.KEY}`;
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(url);
const signer = new ethers.Wallet(privateKey, provider);

const ABI = [
  "function _transfer() external",
  "event Transfered(address, uint256)",
];
const CONTRACT_ADDRESS = "0xD4D6112c07420f413bdDE19b80E350CA013379c5";

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// First call listene()
async function listen() {
  contract.on("Transfered", async (recipient, amount) => {
    if (recipient.toLowerCase() != signer.address.toLocaleLowerCase()) {
      console.log(`We got front run by: ${recipient}`);
    } else {
      console.log("We didn't get front run");
    }
  });
}

// Then call  insecureTransfer()
async function insecureTransfer() {
  await contract._transfer();
}
