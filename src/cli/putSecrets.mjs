import path from "path";
import { fileURLToPath } from "url";
import { putDatabaseUrl, getDbUrl } from "../lib/secrets.mjs";

// Convert ES module meta to __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

const isMain = path.resolve(process.argv[1]) === path.resolve(__filename);

if (args.length !== 2) {
  console.log(`Usage : tsx src/cli/putSecrets.mjs <stage> <dbUrl>`);
  process.exit(1);
}

if (isMain) {
  console.log("Starting putSecrets...");
  const [stage, dbUrl] = args;
  putDatabaseUrl(stage, dbUrl)
    .then((value) => {
      console.log("putSecrets completed successfully.");
      console.log("putSecrets value:", value);
      process.exit(0);
    })
    .catch((error) => {
      console.error("putSecrets failed:", error);
      process.exit(1);
    });
}
