/**
 * Parses Wattly_English_Complete_Curriculum_70_Activities_120_Page_Units.md
 * into src/lib/activities/wattly-curriculum.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const src = resolve(
  process.cwd(),
  "..",
  "EnrichThePlatform",
  "Wattly_English_Complete_Curriculum_70_Activities_120_Page_Units.md",
);
const outDir = resolve(process.cwd(), "src/lib/activities");
const outFile = resolve(outDir, "wattly-curriculum.json");

const md = readFileSync(src, "utf8").replace(/\r\n/g, "\n");

function clean(text) {
  return text
    .replace(/```\{=html\}[\s\S]*?```/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\\\n/g, "\n")
    .replace(/[ \t]*\\$/gm, "")
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

function section(block, name) {
  const start = block.search(new RegExp(`^## ${name}\\s*$`, "m"));
  if (start < 0) return "";
  const rest = block.slice(block.indexOf("\n", start) + 1);
  const next = rest.search(/^## /m);
  return clean(next < 0 ? rest : rest.slice(0, next));
}

function minutes(text) {
  const m = text.match(/(\d+)/);
  return m ? Number(m[1]) : 20;
}

const parts = md.split(/^# Activity (\d+) --- (.+)$/m);
const activities = [];

for (let i = 1; i < parts.length; i += 3) {
  const number = Number(parts[i]);
  const title = clean(parts[i + 1]);
  const block = parts[i + 2] ?? "";
  const externalId = field(block, "Activity ID") || `WAT-${number}`;

  activities.push({
    id: externalId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    number,
    externalId,
    track: "curriculum",
    skill: field(block, "Skill") || "Grammar",
    level: field(block, "Suggested level") || "A1",
    focus: field(block, "Focus"),
    minutes: minutes(field(block, "Estimated time")),
    title,
    outcome: section(block, "Learning outcome"),
    procedure: section(block, "Teaching procedure"),
    model: section(block, "Model and language support"),
    task: section(block, "Learner task"),
    success: section(block, "Success criteria"),
  });
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify({ activities }, null, 2) + "\n");
console.log(`Parsed ${activities.length} curriculum activities -> ${outFile}`);
const empty = activities.filter((a) => !a.task || !a.outcome);
if (empty.length) console.log("Missing task/outcome in:", empty.map((a) => a.externalId).join(", "));
