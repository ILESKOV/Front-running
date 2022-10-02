const { ethers, BigNumber } = require("ethers");

require("dotenv").config();

const url = `https://eth-mainnet.alchemyapi.io/v2/${process.env.KEY}`;
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(url);
const signer = new ethers.Wallet(privateKey, provider);
const {
  FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");

const ABI = [
  "function _transfer() external",
  "event Transfered(address, uint256)",
];
const CONTRACT_ADDRESS = "0xD4D6112c07420f413bdDE19b80E350CA013379c5";

const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_FEE = GWEI.mul(3);
const BLOCKS_IN_THE_FUTURE = 2;

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// Ethereum private key that does not store funds ! Only for flashbot's reputation system.
const authSigner = new ethers.Wallet(
  "0xd96f2628c8ea307f36915e2da82639862a8c44b188de82adfefec37377cc4360"
);

async function flash() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner
  );

  contract.on("Transfered", async (recipient, amount) => {
    if (recipient.toLowerCase() != signer.address.toLocaleLowerCase()) {
      console.log(`We got front run by: ${recipient}`);
    } else {
      console.log("We didn't get front run");
      return "";
    }
  });

  provider.on("block", async (blockNumber) => {
    const block = await provider.getBlock(blockNumber);
    const maxBaseFeeInFutureBlock =
      FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
        block.baseFeePerGas,
        BLOCKS_IN_THE_FUTURE
      );

    const transaction = {
      to: CONTRACT_ADDRESS,
      type: 2,
      maxFeePerGas: PRIORITY_FEE.add(maxBaseFeeInFutureBlock),
      maxPriorityFeePerGas: PRIORITY_FEE,
      gasLimit: 40000,
      data: "0xca9e1993", // bytes4(keccak256("_transfer()"))
      value: 0,
      chainId: 1,
    };

    const signedTransactions = await flashbotsProvider.signBundle([
      {
        signer: signer,
        transaction: transaction,
      },
    ]);
    const tx = await flashbotsProvider.sendRawBundle(
      signedTransactions,
      blockNumber + BLOCKS_IN_THE_FUTURE
    );
    return "";
  });
}

flash();
