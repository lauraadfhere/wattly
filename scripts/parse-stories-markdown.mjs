/**
 * Parses English_Stories_Questions_Answers_A1_to_C2.md into
 * src/lib/stories/stories-content.json (stories, questions and answer keys).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const src = resolve(
  process.cwd(),
  "..",
  "EnrichThePlatform",
  "English_Stories_Questions_Answers_A1_to_C2.md",
);
const outFile = resolve(process.cwd(), "src/lib/stories/stories-content.json");

const lines = readFileSync(src, "utf8").split(/\r?\n/);

const LEVEL_OF = (code) => code.split(".")[0]; // "A1.1" -> "A1"

const stories = [];
let currentLevel = null;
let section = null; // "story" | "questions" | "answers" | null
let current = null;
let block = [];
let qSection = null;
const questionSections = [];

function flush() {
  if (!current) return;
  current.body = block.join("\n").trim();
  current = null;
  block = [];
}

for (const line of lines) {
  const level = line.match(/^# LEVEL (A1|A2|B1|B2|C1|C2)\b/);
  if (level) {
    flush();
    currentLevel = level[1];
    section = null;
    continue;
  }
  const story = line.match(/^## Story ([A-C]\d\.\d) — (.+)$/);
  if (story) {
    flush();
    current = { code: story[1], level: LEVEL_OF(story[1]), title: story[2].trim() };
    stories.push(current);
    section = "story";
    continue;
  }
  if (/^## (A\d|B\d|C\d) answer key/.test(line)) {
    flush();
    section = "answers";
    current = null;
    continue;
  }
  if (line.startsWith("# CROSS-LEVEL")) {
    flush();
    section = null;
    current = null;
    continue;
  }
  if (/^##\s/.test(line) && !/^## Story/.test(line)) {
    flush();
    current = null;
  }
  if (current) block.push(line);
  // Comprehension question headings sit beside the story, not inside it.
  const qHead = line.match(/^### ([A-C]\d\.\d) (?!Story\b)(.*)$/);
  if (qHead && /Questions|Comprehension|Critical|analysis|Discussion|Reading|in context/i.test(qHead[2]) && !/Vocabulary|Grammar|Writing|Speaking|Functional|conditional|Comparatives|Language practice|Everyday|Sentence|transformations|Synthesis|Advanced transformations|Writing task|Mixed review|learning targets/i.test(qHead[2])) {
    qSection = { code: qHead[1], lines: [] };
    questionSections.push(qSection);
    continue;
  }
  if (qSection && (/^#{1,3}\s/.test(line) || line.startsWith("---"))) {
    qSection = null;
  }
  if (qSection) qSection.lines.push(line);
}
flush();

// Split each story body into the prose and its comprehension questions.
const parsed = stories.map((s) => {
  const body = s.body;
  const qIndex = body.search(/^### .*Comprehension questions/m);
  const prose = (qIndex >= 0 ? body.slice(0, qIndex) : body).trim();
  const fromStory = qIndex >= 0 ? body.slice(qIndex).split(/\r?\n/).slice(1) : [];
  const fromHeading =
    questionSections.find((q) => q.code === s.code)?.lines ?? [];
  // The comprehension block is the first 10 numbered items; later items are drills.
  const questions = [...fromStory, ...fromHeading]
    .map((l) => l.match(/^\d+\.\s+(.+)$/)?.[1])
    .filter(Boolean)
    .slice(0, 10);
  return {
    code: s.code,
    level: s.level,
    title: s.title,
    passage: prose.replace(/^#+\s.*$/gm, "").trim(),
    questions,
  };
});

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify({ stories: parsed }, null, 2) + "\n", "utf8");
console.log(
  `Parsed ${parsed.length} stories to ${outFile}; ` +
    `questions: ${parsed.reduce((n, s) => n + s.questions.length, 0)}`,
);
