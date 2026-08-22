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

// @openportfolios/schema 1.0.0 caps person.social at 6 entries. This template
// renders any number of them (the row wraps), so that single error must not
// fail the build. Every other error still does. Drop this once the published
// schema lifts the cap.
function isSocialCapError({ path, message }) {
  return path === "person.social" && message.includes("Too big");
}

const result = validateConfig(parsed);
const errors = result.success ? [] : result.errors.filter((e) => !isSocialCapError(e));

if (errors.length) {
  console.error("Invalid portfolio.config.json:");
  for (const { path, message } of errors) {
    // Some schema messages already lead with the field path.
    console.error(message.startsWith(`${path}:`) ? `  ${message}` : `  ${path}: ${message}`);
  }
  process.exit(1);
}

console.log("portfolio.config.json is valid.");
