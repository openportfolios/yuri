// Validates portfolio.config.json against the official schema before the
// build (wired up as the npm "prebuild" script). An invalid config fails the
// build with the schema's error messages.
import { readFileSync } from "node:fs";
import { validateConfig } from "@openportfolios/schema";

const configUrl = new URL("../portfolio.config.json", import.meta.url);

let parsed;
try {
  parsed = JSON.parse(readFileSync(configUrl, "utf8"));
} catch (error) {
  console.error("Could not read portfolio.config.json:");
  console.error(`  ${error.message}`);
  process.exit(1);
}

const result = validateConfig(parsed);

if (!result.success) {
  console.error("Invalid portfolio.config.json:");
  for (const { path, message } of result.errors) {
    // Some schema messages already lead with the field path.
    console.error(message.startsWith(`${path}:`) ? `  ${message}` : `  ${path}: ${message}`);
  }
  process.exit(1);
}

console.log("portfolio.config.json is valid.");
