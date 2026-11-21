import { readFileSync, writeFileSync } from "node:fs";

const en = JSON.parse(readFileSync("messages/en.json", "utf8"));
function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      merge(target[key], source[key]);
    } else if (!(key in target)) {
      target[key] = source[key];
    }
  }
}

for (const loc of ["fr", "es", "ar"]) {
  const messages = JSON.parse(readFileSync(`messages/${loc}.json`, "utf8"));
  merge(messages, en);
  writeFileSync(`messages/${loc}.json`, `${JSON.stringify(messages, null, 2)}\n`);
  console.log("merged", loc);
}
