import type { Lesson } from "./types";

/** Advanced track for teens / adults building fluent English. */
export const advancedLessons: Lesson[] = [
  {
    id: "adv-debate",
    track: "advanced",
    advancedLevels: ["b2", "c1"],
    title: "Structured Debate",
    tags: ["speaking", "debate", "persuasion"],
    accent: "#0016BD",
    art: "debate",
    minutes: 45,
    summary: "Claim, evidence, rebuttal — speak clearly under time pressure.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Build a 60-second argument with claim, reason, example, and link.",
      },
      {
        type: "words",
        title: "Useful frames",
        items: [
          "I argue that… because…",
          "For example… / Evidence shows…",
          "On the other hand…",
          "To rebut that point…",
          "In conclusion…",
        ],
      },
      {
        type: "play",
        title: "Two-minute clash",
        body: "Pair up. Topic: “Homework should be optional.” Affirmative speaks 60s, negative 60s, then 30s rebuttal each.",
      },
      {
        type: "practice",
        title: "Write your outline",
        items: [
          "Claim (1 sentence)",
          "Two supporting reasons",
          "One counterargument + reply",
          "Closing line",
        ],
      },
      {
        type: "challenge",
        title: "Stretch",
        body: "Record yourself. Cut filler words (um, like, you know) by half.",
      },
    ],
  },
  {
    id: "adv-idioms",
    track: "advanced",
    advancedLevels: ["b1", "b2"],
    title: "Everyday Idioms",
    tags: ["vocabulary", "idioms", "listening"],
    accent: "#ffc933",
    art: "idioms",
    minutes: 30,
    summary: "Ten high-frequency idioms with meaning, example, and swap practice.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Understand and use idioms naturally in short dialogues.",
      },
      {
        type: "words",
        title: "Idiom set",
        items: [
          "break the ice — start a friendly conversation",
          "hit the books — study hard",
          "piece of cake — very easy",
          "under the weather — feeling sick",
          "once in a blue moon — very rarely",
          "cost an arm and a leg — very expensive",
          "spill the beans — reveal a secret",
          "on the same page — agree / understand each other",
        ],
      },
      {
        type: "play",
        title: "Idiom charades",
        body: "Act an idiom without saying it. Class guesses, then uses it in a new sentence.",
      },
      {
        type: "practice",
        title: "Fill the gap",
        items: [
          "The test was a ____ — I finished early.",
          "Let’s ____ before the meeting starts.",
          "I can’t go out; I’m a bit ____.",
        ],
      },
      {
        type: "challenge",
        title: "Dialogue",
        body: "Write an 8-line chat that uses at least 4 idioms correctly.",
      },
    ],
  },
  {
    id: "adv-writing",
    track: "advanced",
    advancedLevels: ["b2", "c1"],
    title: "Clear Paragraph Writing",
    tags: ["writing", "structure", "academic"],
    accent: "#0ea5e9",
    art: "writing",
    minutes: 40,
    summary: "Topic sentence, support, cohesion — one polished paragraph.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Write a 120–150 word paragraph with clear topic, support, and ending.",
      },
      {
        type: "words",
        title: "Cohesion tools",
        items: [
          "Firstly / Furthermore / However / As a result / In short",
          "This shows that… / Another reason is…",
          "Avoid repeating the same noun — use it / they / this idea",
        ],
      },
      {
        type: "play",
        title: "Sentence surgery",
        body: "Take a messy draft. Cut fluff, fix tense, and merge short choppy lines.",
      },
      {
        type: "practice",
        title: "Prompt",
        body: "Topic: “Why learning a language opens doors.” Write one paragraph with a topic sentence, two examples, and a closing sentence.",
      },
      {
        type: "challenge",
        title: "Peer edit",
        body: "Swap paragraphs. Mark one strength and one precise fix (not “make it better”).",
      },
    ],
  },
  {
    id: "adv-listening",
    track: "advanced",
    advancedLevels: ["b1", "b2", "c1"],
    title: "Active Listening Notes",
    tags: ["listening", "notes", "summary"],
    accent: "#6366f1",
    art: "listening",
    minutes: 35,
    summary: "Catch main ideas, signal words, and paraphrase without copying.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Take notes while listening and produce a 3-sentence summary.",
      },
      {
        type: "words",
        title: "Signal words",
        items: [
          "The main point is… / In other words…",
          "For instance… / That said…",
          "To sum up…",
        ],
      },
      {
        type: "play",
        title: "Pause & predict",
        body: "Play a short talk. Pause mid-way — predict the next point, then check.",
      },
      {
        type: "practice",
        title: "Note grid",
        items: [
          "Main idea",
          "Two supporting details",
          "One example",
          "Speaker’s attitude (positive / cautious / critical)",
        ],
      },
      {
        type: "challenge",
        title: "Paraphrase",
        body: "Rewrite the summary without using the speaker’s exact phrases.",
      },
    ],
  },
];
