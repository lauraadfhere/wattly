/**
 * Parses Kinpal_English_Curriculum_A1_C1_50_Grammar_50_Reading.md
 * into src/lib/curriculum/kinpal-data.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const src = resolve(
  process.cwd(),
  "..",
  "Kinpal_English_Curriculum_A1_C1_50_Grammar_50_Reading.md",
);
const outDir = resolve(process.cwd(), "src/lib/curriculum");
const outFile = resolve(outDir, "kinpal-data.json");

const md = readFileSync(src, "utf8");
const lines = md.split(/\r?\n/);

function clean(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/--/g, "–")
    .replace(/\*\*/g, "")
    .trim();
}

function parseDuration(text) {
  const m = text.match(/(\d+)\s*min/i);
  return m ? Number(m[1]) : 15;
}

function parseAnswers(block) {
  const answers = [];
  const joined = block.join("\n");
  // Patterns like "1.  1.  am" or "1.  Because..."
  const nested = [...joined.matchAll(/\d+\.\s+\d+\.\s+(.+)/g)].map((m) =>
    clean(m[1]),
  );
  if (nested.length) return nested;
  const plain = [...joined.matchAll(/^\s*\d+\.\s+(.+)/gm)].map((m) =>
    clean(m[1]),
  );
  return plain;
}

function splitNumbered(text) {
  const normalized = text.replace(/\\_/g, "_").replace(/_+/g, "____");
  const matches = [
    ...normalized.matchAll(/(\d+)\)\s*([\s\S]*?)(?=\s*\d+\)|$)/g),
  ];
  return matches
    .map((m) => clean(m[2]))
    .filter((item) => item && !/^\d+$/.test(item));
}

const grammar = [];
const reading = [];
let mode = null; // grammar | reading
let level = "A1";
let current = null;
let section = null; // activity | answers | questions | passage
let buffer = [];

function flushBuffer() {
  if (!current || !section) {
    buffer = [];
    return;
  }
  const text = buffer.join("\n").trim();
  if (!text) {
    buffer = [];
    return;
  }
  if (section === "activity") {
    current.prompt = clean(text);
    current.items = splitNumbered(text);
  } else if (section === "answers") {
    current.answers = parseAnswers(buffer);
  } else if (section === "questions") {
    current.questions = parseAnswers(buffer);
  } else if (section === "passage") {
    current.passage = clean(text);
  }
  buffer = [];
}

function pushCurrent() {
  flushBuffer();
  if (!current) return;
  if (current.kind === "grammar") {
    if (!current.items?.length && current.prompt) {
      current.items = splitNumbered(current.prompt);
    }
    grammar.push({
      id: `grammar-${current.number}`,
      kind: "grammar",
      level: current.level,
      number: current.number,
      title: current.title,
      durationMin: current.durationMin,
      goal: current.goal || "",
      examples: current.examples || "",
      prompt: current.prompt || "",
      items: current.items || [],
      answers: current.answers || [],
    });
  } else if (current.kind === "reading") {
    reading.push({
      id: `reading-${current.number}`,
      kind: "reading",
      level: current.level,
      number: current.number,
      title: current.title,
      subject: current.subject || "",
      durationMin: current.durationMin,
      passage: current.passage || "",
      questions: current.questions || [],
      answers: current.answers || [],
    });
  }
  current = null;
  section = null;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  if (/^# PART 1/.test(trimmed)) {
    pushCurrent();
    mode = "grammar";
    continue;
  }
  if (/^# PART 2/.test(trimmed)) {
    pushCurrent();
    mode = "reading";
    continue;
  }
  if (/^# A1/.test(trimmed)) {
    pushCurrent();
    level = "A1";
    continue;
  }
  if (/^# A2/.test(trimmed)) {
    pushCurrent();
    level = "A2";
    continue;
  }
  if (/^# B1/.test(trimmed)) {
    pushCurrent();
    level = "B1";
    continue;
  }
  if (/^# B2/.test(trimmed)) {
    pushCurrent();
    level = "B2";
    continue;
  }
  if (/^# C1/.test(trimmed)) {
    pushCurrent();
    level = "C1";
    continue;
  }

  const lesson = trimmed.match(/^## Lesson (\d+):\s*(.+)$/);
  if (lesson && mode === "grammar") {
    pushCurrent();
    current = {
      kind: "grammar",
      level,
      number: Number(lesson[1]),
      title: clean(lesson[2]),
      durationMin: 20,
      goal: "",
      examples: "",
      prompt: "",
      items: [],
      answers: [],
    };
    section = null;
    continue;
  }

  const readingHead = trimmed.match(/^## Reading (\d+):\s*(.+)$/);
  if (readingHead && mode === "reading") {
    pushCurrent();
    current = {
      kind: "reading",
      level,
      number: Number(readingHead[1]),
      title: clean(readingHead[2]),
      subject: "",
      durationMin: 10,
      passage: "",
      questions: [],
      answers: [],
    };
    section = "passage";
    continue;
  }

  if (!current) continue;

  if (/^Estimated duration:/i.test(trimmed)) {
    flushBuffer();
    current.durationMin = parseDuration(trimmed);
    // also capture learning+practice totals like "20 minutes"
    const total = trimmed.match(/(\d+)\s*minutes?/i);
    if (total) current.durationMin = Number(total[1]);
    section = null;
    continue;
  }

  if (/^Learning goal:/i.test(trimmed)) {
    flushBuffer();
    current.goal = clean(trimmed.replace(/^Learning goal:\s*/i, ""));
    section = "goalContinue";
    continue;
  }

  if (/^Examples:/i.test(trimmed)) {
    flushBuffer();
    current.examples = clean(trimmed.replace(/^Examples:\s*/i, ""));
    section = "examplesContinue";
    continue;
  }

  if (/^Level \/ subject:/i.test(trimmed)) {
    flushBuffer();
    current.subject = clean(trimmed.replace(/^Level \/ subject:\s*/i, ""));
    section = "passage";
    continue;
  }

  if (/^### Activity/i.test(trimmed)) {
    flushBuffer();
    section = "activity";
    continue;
  }

  if (/^### Comprehension questions/i.test(trimmed)) {
    flushBuffer();
    section = "questions";
    continue;
  }

  if (/^### Answer key/i.test(trimmed)) {
    flushBuffer();
    section = "answers";
    continue;
  }

  if (/^## /.test(trimmed) || /^# /.test(trimmed)) {
    flushBuffer();
    section = null;
    continue;
  }

  if (section === "goalContinue") {
    if (!trimmed || /^(Examples:|### |## |# )/i.test(trimmed)) {
      section = null;
      i -= 1;
      continue;
    }
    current.goal = clean(`${current.goal} ${trimmed}`);
    continue;
  }

  if (section === "examplesContinue") {
    if (!trimmed || /^(### |## |# )/i.test(trimmed)) {
      section = null;
      i -= 1;
      continue;
    }
    current.examples = clean(`${current.examples} ${trimmed}`);
    continue;
  }

  if (section) {
    buffer.push(line);
  } else if (
    current.kind === "reading" &&
    trimmed &&
    !/^Learner instruction/i.test(trimmed)
  ) {
    if (
      !current.passage &&
      !/^Estimated/i.test(trimmed) &&
      !/^Level/i.test(trimmed)
    ) {
      section = "passage";
      buffer.push(line);
    }
  }
}

pushCurrent();

mkdirSync(outDir, { recursive: true });
const payload = {
  source: "Kinpal_English_Curriculum_A1_C1_50_Grammar_50_Reading.md",
  levels: ["A1", "A2", "B1", "B2", "C1"],
  grammar,
  reading,
};
writeFileSync(outFile, JSON.stringify(payload, null, 2));
console.log(
  `Wrote ${grammar.length} grammar + ${reading.length} reading → ${outFile}`,
);
if (grammar.length !== 50 || reading.length !== 50) {
  console.warn("Unexpected counts — check parser.");
  process.exitCode = 1;
}
