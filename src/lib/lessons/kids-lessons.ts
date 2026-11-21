import type { Lesson } from "./types";

/** Sourced from English for Kids (ages 5–9) activity book. */
export const kidsLessons: Lesson[] = [
  {
    id: "kids-abc",
    track: "kids",
    kidsLevels: ["beginner", "growing"],
    title: "The ABC Adventure",
    tags: ["alphabet", "phonics", "sounds"],
    accent: "#38bdf8",
    art: "abc",
    minutes: 25,
    summary: "Learn 26 letters, sounds, and one word for each letter.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Learn the alphabet, letter sounds, and a word for each letter.",
      },
      {
        type: "words",
        title: "Alphabet & sounds",
        body: "Vowels (singing letters): A E I O U. Every English word needs a vowel sound.",
        items: [
          "Aa — apple",
          "Bb — ball",
          "Cc — cat",
          "Dd — dog",
          "Ff — fish",
          "Ss — sun",
          "Zz — zebra",
        ],
      },
      {
        type: "play",
        title: "Sound Detective",
        body: "Teacher says a sound (like /b/). Children find something that starts with that sound. Try “I Spy” too.",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "Match: B→ball, S→sun, C→cat, D→dog, F→fish",
          "Fill first letter: ___at, ___og, ___un, ___ish, ___all",
          "Trace A a, B b, C c three times each",
        ],
      },
      {
        type: "challenge",
        title: "Challenge",
        body: "Put in ABC order: monkey, apple, zebra, dog, banana → apple, banana, dog, monkey, zebra",
      },
    ],
  },
  {
    id: "kids-colors",
    track: "kids",
    kidsLevels: ["beginner", "growing", "confident"],
    title: "Colors & Shapes",
    tags: ["vocabulary", "colors", "shapes"],
    accent: "#f97316",
    art: "colors",
    minutes: 30,
    summary: "Twelve colors, eight shapes, and simple describing sentences.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Name colors and shapes, then use them in short sentences.",
      },
      {
        type: "words",
        title: "Colors & shapes",
        items: [
          "Colors: red, orange, yellow, green, blue, purple, brown, black, white, pink, gray, gold",
          "Shapes: circle, square, triangle, rectangle, star, heart, diamond, oval",
        ],
      },
      {
        type: "play",
        title: "Color Hunt & Shape Bingo",
        body: "Call a color — children find it and say “It is green! It is a leaf!” Play 3×3 shape bingo until someone shouts BINGO.",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "The banana is ________. (yellow)",
          "The grass is ________. (green)",
          "A clock is a ________. (circle)",
          "A door is a ________. (rectangle)",
          "Draw a house with square, triangle, rectangle, circle",
        ],
      },
      {
        type: "challenge",
        title: "Mixing colors",
        items: [
          "red + yellow = orange",
          "blue + yellow = green",
          "red + blue = purple",
          "red + white = pink",
        ],
      },
    ],
  },
  {
    id: "kids-animals",
    track: "kids",
    kidsLevels: ["beginner", "growing", "confident"],
    title: "Animal Friends",
    tags: ["vocabulary", "story", "animals"],
    accent: "#22c55e",
    art: "animals",
    minutes: 35,
    summary: "Farm, wild, and pet animals — plus Mimi the Little Cat.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Learn animal words and sounds, then read a short story.",
      },
      {
        type: "words",
        title: "Animals & sounds",
        items: [
          "Farm: cow–moo, pig–oink, sheep–baa, hen–cluck, horse–neigh, duck–quack",
          "Wild: lion–roar, elephant–trumpet, monkey–ooh, snake–hiss, bear–growl",
          "Pets: dog–woof, cat–meow, rabbit, fish–blub, bird–tweet",
        ],
      },
      {
        type: "play",
        title: "Charades & Who Am I?",
        body: "Act an animal with sounds only. Or solve riddles: “I am big and gray. I have a long nose.” → elephant.",
      },
      {
        type: "story",
        title: "Mimi the Little Cat",
        body: "Mimi is a little white-and-gray cat with big green eyes. She wakes up hungry, meets a duck and a dog, plays with a red ball, then goes home for milk and fish — and sleeps in her warm basket.",
      },
      {
        type: "practice",
        title: "Comprehension",
        items: [
          "What color is Mimi?",
          "Who says quack?",
          "What do they play with?",
          "Match: cow–moo, duck–quack, lion–roar, snake–hiss, sheep–baa",
        ],
      },
      {
        type: "challenge",
        title: "Write about your favorite animal",
        body: "My favorite animal is a ____. It is ____. It can ____. It lives in ____. I like it because ____.",
      },
    ],
  },
  {
    id: "kids-nouns",
    track: "kids",
    kidsLevels: ["growing", "confident"],
    title: "Naming Words: Nouns",
    tags: ["grammar", "nouns", "a-an"],
    accent: "#a855f7",
    art: "nouns",
    minutes: 30,
    summary: "Person, place, animal, thing — plus a/an and plurals.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Know what a noun is. Use a/an, singular/plural, and This is / These are.",
      },
      {
        type: "words",
        title: "Rules",
        items: [
          "Noun = person, place, animal, or thing",
          "a before consonant sound · an before vowel sound",
          "Add -s / -es for plurals · baby→babies · child→children",
          "This is a pen. · These are pens.",
        ],
      },
      {
        type: "play",
        title: "Noun Basket",
        body: "Pull objects from a bag and say “This is a spoon” or “This is an apple.” Then pair two: “These are two spoons.”",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "a or an: ___ apple, ___ banana, ___ elephant, ___ umbrella",
          "Plurals: cat→, box→, baby→, child→, foot→",
          "This is / These are with one vs many apples and cars",
        ],
      },
      {
        type: "challenge",
        title: "Proper nouns",
        body: "Names start with a capital: Fix — my friend omar lives in algeria.",
      },
    ],
  },
  {
    id: "kids-family",
    track: "kids",
    kidsLevels: ["beginner", "growing", "confident"],
    title: "My Family & Feelings",
    tags: ["vocabulary", "family", "feelings", "story"],
    accent: "#ec4899",
    art: "family",
    minutes: 35,
    summary: "Family words, feelings, greetings, and A Happy Sunday.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Talk about family members and feelings, then read a family story.",
      },
      {
        type: "words",
        title: "Family & feelings",
        items: [
          "mother, father, brother, sister, baby, grandma, grandpa, aunt, uncle, cousin",
          "happy, sad, angry, tired, scared, excited, hungry, surprised",
          "Good morning / afternoon / evening / night · Hello · Goodbye",
        ],
      },
      {
        type: "play",
        title: "Feelings Faces & Family Tree",
        body: "Pick a feeling card and make the face. Draw a family tree with names under each person.",
      },
      {
        type: "story",
        title: "A Happy Sunday",
        body: "Lina is excited — grandparents visit. Omar is her little brother. Grandma brings cakes and a toy car; Grandpa brings a story book. They eat together, listen to a story, then say goodbye. Lina loves her family.",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "Who is Omar? How old is he?",
          "Match: lost my toy→sad · got a gift→happy · need sleep→tired",
          "This is my ____ (mother / grandpa / baby)",
        ],
      },
      {
        type: "challenge",
        title: "Write about your family",
        body: "There are ___ people in my family. My mother’s name is ____. I love my family because ____.",
      },
    ],
  },
  {
    id: "kids-verbs",
    track: "kids",
    kidsLevels: ["growing", "confident"],
    title: "Action Words: Verbs",
    tags: ["grammar", "verbs", "can-cant"],
    accent: "#eab308",
    art: "verbs",
    minutes: 30,
    summary: "Action words, he/she + -s, can/can’t, and -ing now.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Use verbs, present simple with -s, and can / can’t.",
      },
      {
        type: "words",
        title: "Verbs",
        items: [
          "run, jump, eat, drink, sleep, read, write, draw, sing, dance, swim, play, walk",
          "I/you/we/they run · he/she/it runs",
          "I can swim. · I can’t fly. · Can you swim?",
        ],
      },
      {
        type: "play",
        title: "Simon Says & Verb Mime",
        body: "Only move when you hear “Simon says…” Act swim, sleep, eat — others guess “You are swimming!”",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "She ____ (run/runs) fast.",
          "A bird ____ fly. A fish ____ walk. (can/can’t)",
          "The boy is ____ (swimming / reading / eating)",
        ],
      },
      {
        type: "challenge",
        title: "Write your day",
        body: "I wake up at ____. I eat ____ for breakfast. I play ____ in the afternoon.",
      },
    ],
  },
  {
    id: "kids-balloon",
    track: "kids",
    kidsLevels: ["growing", "confident"],
    title: "The Lost Balloon",
    tags: ["reading", "story", "comprehension"],
    accent: "#ef4444",
    art: "balloon",
    minutes: 40,
    summary: "A birthday balloon, a windy park, and a kind old lady.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Read a longer story, learn new words, and retell what happened.",
      },
      {
        type: "words",
        title: "Before you read",
        items: [
          "balloon, string, wind, fly, search, brave, kind, gift, proud",
        ],
      },
      {
        type: "story",
        title: "The Lost Balloon",
        body: "Adam turns seven and gets a shiny red balloon. In the park, the wind takes it away. With Nora he searches bravely. An old lady finds it in her rose bush, returns it with cookies, and Mom is proud — best birthday ever.",
      },
      {
        type: "practice",
        title: "Questions",
        items: [
          "What color is the balloon? How old is Adam?",
          "Why does the balloon fly away?",
          "Where was the balloon? What does the old lady give them?",
          "Order: birthday gift → park → wind → search → old lady → cake",
        ],
      },
      {
        type: "challenge",
        title: "Draw and retell",
        body: "Draw 4 pictures. Write: First… Then… Next… At the end…",
      },
    ],
  },
  {
    id: "kids-adjectives",
    track: "kids",
    kidsLevels: ["growing", "confident"],
    title: "Adjectives & Opposites",
    tags: ["grammar", "adjectives", "opposites"],
    accent: "#06b6d4",
    art: "adjectives",
    minutes: 30,
    summary: "Describe nouns, learn opposites, and compare with -er / -est.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Use adjectives to describe things and learn opposites.",
      },
      {
        type: "words",
        title: "Describing words",
        items: [
          "Size: big, small, tall, short · Touch: soft, hard, hot, cold",
          "Opposites: big↔small, hot↔cold, fast↔slow, happy↔sad, up↔down",
          "taller / tallest · bigger / biggest · happier / happiest",
        ],
      },
      {
        type: "play",
        title: "Opposite Game & Mystery Bag",
        body: "Teacher says Hot! — children shout Cold! Feel an object in a bag and describe it: soft, small, round.",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "The sun is ____. A pillow is ____. (hot / soft)",
          "Write opposites: big, hot, fast, happy, clean",
          "An elephant is ____ than a dog. (bigger)",
        ],
      },
      {
        type: "challenge",
        title: "My Monster",
        body: "Draw a funny monster. Describe it with at least 5 adjectives.",
      },
    ],
  },
  {
    id: "kids-food",
    track: "kids",
    kidsLevels: ["beginner", "growing", "confident"],
    title: "Where Is It? Food & Place",
    tags: ["prepositions", "food", "speaking"],
    accent: "#84cc16",
    art: "food",
    minutes: 35,
    summary: "in / on / under, food words, and picnic manners.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Use place words and food vocabulary with I like / I want.",
      },
      {
        type: "words",
        title: "Prepositions & food",
        items: [
          "in, on, under, next to, behind, in front of, between, above",
          "Fruits: apple, banana, orange · Food: bread, rice, pizza, sandwich",
          "I like pizza. · I don’t like onions. · Can I have some water, please?",
        ],
      },
      {
        type: "play",
        title: "Teddy & Restaurant",
        body: "Hide a teddy — “It is under the table!” Role-play waiter and customer ordering food politely.",
      },
      {
        type: "story",
        title: "The Picnic",
        body: "Sara and friends sit under a tree. Sandwiches and apples are in the basket. Ali wants water. A small dog sits next to the basket — they share a cookie.",
      },
      {
        type: "practice",
        title: "Practice",
        items: [
          "The book is ____ the table. The cat is ____ the table.",
          "Sort fruits vs vegetables",
          "Write 3 foods you like and 3 you don’t like",
        ],
      },
      {
        type: "challenge",
        title: "Design a menu",
        body: "Invent a restaurant name with 2 starters, 2 mains, 2 desserts, 2 drinks.",
      },
    ],
  },
  {
    id: "kids-garden",
    track: "kids",
    kidsLevels: ["confident"],
    title: "The Magic Garden",
    tags: ["review", "story", "games"],
    accent: "#10b981",
    art: "garden",
    minutes: 40,
    summary: "Review everything with a magic story and final games.",
    sections: [
      {
        type: "goal",
        title: "Goal",
        body: "Review nouns, verbs, adjectives, and prepositions in one adventure.",
      },
      {
        type: "words",
        title: "Quick review",
        items: [
          "Alphabet · colors · a/an · verb -s · adjectives · in/on/under · can/can’t",
        ],
      },
      {
        type: "story",
        title: "The Magic Garden",
        body: "Yara finds a golden key under a flower pot. Behind a wooden door: talking animals and a dry fountain. She carries water from behind the mountain, saves the garden, and plants a tiny seed that grows into a golden flower.",
      },
      {
        type: "practice",
        title: "Review games",
        items: [
          "True/False: The key is golden. The water is behind the mountain.",
          "Find 3 nouns, 3 verbs, 3 adjectives, 3 prepositions from the story",
          "Spelling bee: cat · apple · elephant",
        ],
      },
      {
        type: "challenge",
        title: "Write your own story",
        body: "5 parts: beginning, problem, adventure, solution, ending. Use 3 adjectives, 3 verbs, 2 prepositions, and one can/can’t sentence.",
      },
    ],
  },
];
