/** Short context blurbs for kids PDF books (from Wattly children's series). */
export const kidsContextById: Record<string, string> = {
  "kids-hello-sunny":
    "Sunny the chick wakes up, greets friends, and learns hello, please, thank you, and goodbye.\n\nTalk about: What is the chick’s name? How do you say hello?",
  "kids-alphabet-adventure":
    "A fun alphabet journey from A to Z with simple words for each letter.\n\nTalk about: Which letter starts your name? Can you say three alphabet letters?",
  "kids-lost-dragon":
    "A little dragon is lost. Kind friends help him find his way home.\n\nTalk about: How can we help a friend who is lost or sad?",
  "kids-day-zoo":
    "A day at the zoo — animals, colours, and describing words.\n\nTalk about: Which zoo animal do you like? What colour is it?",
  "kids-colourful-world":
    "Colours everywhere — objects, clothes, and simple descriptions.\n\nTalk about: What colour is your bag? Name three colours you see today.",
  "kids-magic-school-bag":
    "Classroom objects and school routines inside a magic bag.\n\nTalk about: What do you bring to school? What is in your bag?",
  "kids-friends-forest":
    "Forest friends learn to share and play together.\n\nTalk about: Who is your friend? How do you share with them?",
  "kids-little-chef":
    "Cooking words, actions, and simple kitchen instructions.\n\nTalk about: What food do you like? Can you say wash, cut, mix?",
  "kids-where-teddy":
    "Home places and feelings while searching for a teddy.\n\nTalk about: Where do you keep your toys? How do you feel when you find something?",
  "kids-big-blue-sea":
    "Sea animals and action words by the big blue sea.\n\nTalk about: Can you swim? Name two sea animals.",
};

export function kidsContextHtml(id: string) {
  const text = kidsContextById[id];
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => `<p>${line || "&nbsp;"}</p>`)
    .join("");
}
