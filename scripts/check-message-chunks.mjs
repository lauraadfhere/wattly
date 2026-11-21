import fs from "node:fs";
import path from "node:path";

const dir = ".next/dev/server/chunks/ssr";
if (!fs.existsSync(dir)) {
  console.log("No chunks dir");
  process.exit(0);
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.includes("messages_") && f.endsWith(".js"));

console.log("files", files);

for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  const marker = "JSON.parse(";
  const start = s.indexOf(marker);
  if (start < 0) {
    console.log(f, "no JSON.parse");
    continue;
  }

  const quote = s[start + marker.length];
  if (quote !== '"' && quote !== "'") {
    console.log(f, "unexpected quote", quote);
    continue;
  }

  let i = start + marker.length + 1;
  let raw = "";
  let esc = false;
  for (; i < s.length; i++) {
    const c = s[i];
    if (esc) {
      raw += c;
      esc = false;
      continue;
    }
    if (c === "\\") {
      raw += c;
      esc = true;
      continue;
    }
    if (c === quote) break;
    raw += c;
  }

  // raw is the escaped contents inside the JS string literal
  // Rebuild a JSON string value and parse it
  try {
    const jsonText = JSON.parse(`"${raw}"`);
    JSON.parse(jsonText);
    console.log(f, "OK", "jsonTextLen", jsonText.length);
  } catch (e) {
    console.log(f, "FAIL", e.message);
    try {
      const jsonText = JSON.parse(`"${raw}"`);
      console.log("around 832:", JSON.stringify(jsonText.slice(800, 880)));
      console.log("char832:", JSON.stringify(jsonText[832]));
    } catch (e2) {
      console.log("could not decode string literal", e2.message);
      console.log("raw around 832:", JSON.stringify(raw.slice(800, 880)));
    }
  }
}
