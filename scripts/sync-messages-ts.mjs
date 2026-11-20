/**
 * Regenerates messages/*.ts from messages/*.json (source of truth for copy).
 * Usage: node scripts/sync-messages-ts.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

for (const locale of ["en", "fr", "es", "ar"]) {
  const obj = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
  const body = `const messages = ${JSON.stringify(obj, null, 2)} as const;\n\nexport default messages;\n`;
  writeFileSync(`messages/${locale}.ts`, body);
  console.log(`synced messages/${locale}.ts`);
}
