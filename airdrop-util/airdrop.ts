import { Connection, LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";
import yargs from "yargs";
import { isFilePath, readFileAsArray } from "./utils/files";
import { Arguments } from "./utils/arguments";

const argv = yargs
  .option("key", {
    alias: "k",
    default: "none",
    description: "Wallet public key or JSON file path",
    type: "string",
    demandOption: true,
  })
  .option("url", {
    alias: "u",
    default: "http://localhost:8899",
    description: "Custom url",
    type: "string",
  })
  .option("cluster", {
    alias: "c",
    default: "custom",
    description: "Transactions cluster",
    type: "string",
  })
  .option("supply", {
    alias: "s",
    default: 1,
    description: "Airdrop supply size",
    type: "number",
  })
  .option("loop", {
    alias: "l",
    default: 1,
    description: "The number of loops",
    type: "number",
  })
  .option("delay", {
    alias: "d",
    default: 0,
    description: "Millisecond delay between airdrops",
    type: "number",
  })
  .help()
  .alias("help", "h").argv as Arguments;

var public_keys: PublicKey[] = [];
if (isFilePath(argv.key)) {
  const keys = readFileAsArray(argv.key);
  for (var key of keys) public_keys.push(new PublicKey(key));
} else if (argv.key == "none") {
  for (let i = 0; i <= argv.loop - 1; i++) public_keys.push(Keypair.generate().publicKey);
} else {
  public_keys.push(new PublicKey(argv.key));
}

const connection = new Connection(argv.url);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    for (let i = 0; i <= argv.loop - 1; i++) {
      const txhash = await connection.requestAirdrop(
        public_keys[i % public_keys.length],
        argv.supply * LAMPORTS_PER_SOL
      );
      console.log(`Success! Check out your TX here:
     https://explorer.solana.com/tx/${txhash}?cluster=${encodeURIComponent(
        argv.cluster
      )}&customUrl=${encodeURIComponent(argv.url)}`);
      await sleep(argv.delay);
    }
  } catch (e) {
    console.error(`Something went wrong: ${e}`);
  }
})();
