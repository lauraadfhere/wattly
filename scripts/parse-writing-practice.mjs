/**
 * Parses 100_English_Writing_Practice_All_Ages.md
 * into src/lib/activities/writing-practice.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const src = resolve(
  process.cwd(),
  "..",
  "EnrichThePlatform",
  "100_English_Writing_Practice_All_Ages.md",
);
const outDir = resolve(process.cwd(), "src/lib/activities");
const outFile = resolve(outDir, "writing-practice.json");

const md = readFileSync(src, "utf8").replace(/\r\n/g, "\n");

function clean(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/--/g, "–")
    .replace(/\s*\n\s*/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function field(block, name) {
  const m = block.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*(.+)`));
  return m ? clean(m[1]) : "";
}

const groups = [...md.matchAll(/^# GROUP (\d+) — (.+?)\s*$/gm)].map((m) => ({
  number: Number(m[1]),
  label: clean(m[2]),
  start: m.index ?? 0,
}));

const activities = [];

for (let g = 0; g < groups.length; g++) {
  const group = groups[g];
  const end = g + 1 < groups.length ? groups[g + 1].start : md.length;
  const body = md.slice(group.start, end);
  const range = body.match(/\*\*Suggested language range:\*\*\s*(.+)/);
  const level = range ? clean(range[1]) : "";

  for (const m of body.matchAll(/^## (\d+)\. (.+?)\s*$/gm)) {
    const number = Number(m[1]);
    const title = clean(m[2]);
    const startIdx = m.index ?? 0;
    const rest = body.slice(startIdx + m[0].length);
    const next = rest.search(/^(?:## \d+\. |# )/m);
    const block = next < 0 ? rest : rest.slice(0, next);

    const after = block.match(/\*\*After writing:\*\*\s*([^\n]+)/);

    activities.push({
      id: `wri-${String(number).padStart(3, "0")}`,
      number,
      externalId: `WAT-W${String(number).padStart(3, "0")}`,
      track: "writing",
      skill: "Writing",
      level,
      group: group.number,
      groupLabel: group.label,
      genre: field(block, "Genre"),
      length: field(block, "Suggested length"),
      title,
      task: field(block, "Writing task"),
      success: field(block, "Success focus"),
      after: after ? clean(after[1]) : "",
    });
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify({ activities }, null, 2) + "\n");
console.log(`Parsed ${activities.length} writing activities -> ${outFile}`);
const empty = activities.filter((a) => !a.task);
if (empty.length) console.log("Missing task in:", empty.map((a) => a.id).join(", "));
