import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
require("dotenv").config();

const CONTRACT_ADDRESS = "0x352897A49bAeBe92eDB34aF2806DDBA028b5F995";

async function main() {

  // Choose your provider
  //   const provider = ethers.getDefaultProvider("goerli");
  //   const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing environment: Private key");
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  // 1: Attach Contract
  const ballotCF = new Ballot__factory(signer);
  console.log("Attaching to contract ...");
  const ballotC = ballotCF.attach(CONTRACT_ADDRESS);
  console.log(`Attached to Ballot contract at ${ballotC.address}`);

  // 2: Return name of winning proposal
  const TxReceipt = ethers.utils.parseBytes32String(await ballotC.winnerName());
  console.log({ TxReceipt });

  console.log(`The winning proposal is: ${TxReceipt}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
