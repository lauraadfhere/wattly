/**
 * Uploads Wattly library assets to Cloudinary and writes catalog JSON.
 * Kids: covers + PDFs from ChildrenStories
 * Adults: covers + EPUBs from elspith/BOOKSONLINE
 *
 * Usage: node --env-file=.env.local scripts/upload-library-assets.mjs
 */
import { v2 as cloudinary } from "cloudinary";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "dp5g9tinm";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config(true);
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const KIDS_ROOT = resolve(
  process.cwd(),
  "..",
  "ChildrenStories",
);
const ADULT_ROOT = resolve("C:/Users/DELL/Desktop/elspith/BOOKSONLINE");
const OUT = resolve(process.cwd(), "src/lib/library/catalog.json");

const kidsBooks = [
  {
    id: "kids-hello-sunny",
    title: "Hello, Sunny!",
    theme: "Greetings and everyday phrases",
    level: "Pre-A1",
    ages: "5–7",
    coverFile: "01_Hello_Sunny_Cover.jpg",
    pdfFile: "01_Hello_Sunny.pdf",
  },
  {
    id: "kids-alphabet-adventure",
    title: "The Alphabet Adventure",
    theme: "The alphabet A to Z",
    level: "Pre-A1",
    ages: "5–7",
    coverFile: "02_The_Alphabet_Adventure_Cover.jpg",
    pdfFile: "02_The_Alphabet_Adventure.pdf",
  },
  {
    id: "kids-lost-dragon",
    title: "The Lost Little Dragon",
    theme: "Bravery, kindness and friendship",
    level: "A1",
    ages: "6–8",
    coverFile: "03_The_Lost_Little_Dragon_Cover.jpg",
    pdfFile: "03_The_Lost_Little_Dragon.pdf",
  },
  {
    id: "kids-day-zoo",
    title: "A Day at the Zoo",
    theme: "Zoo animals and describing words",
    level: "A1",
    ages: "6–8",
    coverFile: "04_A_Day_at_the_Zoo_Cover.jpg",
    pdfFile: "04_A_Day_at_the_Zoo.pdf",
  },
  {
    id: "kids-colourful-world",
    title: "My Colourful World",
    theme: "Colors, objects and descriptions",
    level: "A1",
    ages: "5–8",
    coverFile: "05_My_Colourful_World_Cover.jpg",
    pdfFile: "05_My_Colourful_World.pdf",
  },
  {
    id: "kids-magic-school-bag",
    title: "The Magic School Bag",
    theme: "School life and classroom objects",
    level: "A1",
    ages: "6–9",
    coverFile: "06_The_Magic_School_Bag_Cover.jpg",
    pdfFile: "06_The_Magic_School_Bag.pdf",
  },
  {
    id: "kids-friends-forest",
    title: "Friends in the Forest",
    theme: "Friendship, nature and sharing",
    level: "A1",
    ages: "6–9",
    coverFile: "07_Friends_in_the_Forest_Cover.jpg",
    pdfFile: "07_Friends_in_the_Forest.pdf",
  },
  {
    id: "kids-little-chef",
    title: "The Little Chef",
    theme: "Food words, actions and instructions",
    level: "A1",
    ages: "6–9",
    coverFile: "08_The_Little_Chef_Cover.jpg",
    pdfFile: "08_The_Little_Chef.pdf",
  },
  {
    id: "kids-where-teddy",
    title: "Where Is My Teddy?",
    theme: "Home, family, places and feelings",
    level: "A1",
    ages: "5–8",
    coverFile: "09_Where_Is_My_Teddy_Cover.jpg",
    pdfFile: "09_Where_Is_My_Teddy.pdf",
  },
  {
    id: "kids-big-blue-sea",
    title: "The Big Blue Sea",
    theme: "Sea animals, places and action words",
    level: "A1–A2",
    ages: "6–9",
    coverFile: "10_The_Big_Blue_Sea_Cover.jpg",
    pdfFile: "10_The_Big_Blue_Sea.pdf",
  },
];

const adultBooks = [
  {
    id: "adults-babbylon",
    title: "Babbylon",
    author: "Wattly Voices",
    level: "B1–B2",
    summary: "A narrative ebook for confident intermediate readers.",
    pages: 48,
    epub: "Babbylon/EPUB/Babbylon.epub",
    cover: "Babbylon/2186ce9e-91a1-496d-a31d-260ef1b00283.png",
  },
  {
    id: "adults-do-not-click",
    title: "Do Not Click",
    author: "Wattly Voices",
    level: "B1–B2",
    summary: "Practical online-safety lessons in ebook form.",
    pages: 36,
    epub: "DONOTCLICK/ebook/EPUB/EBBOK.epub",
    cover: "DONOTCLICK/COVERS/FULL CORRETVED VERSION.png",
  },
  {
    id: "adults-sports-injuries",
    title: "Prevent Sports Injuries",
    author: "Wattly Voices",
    level: "B2",
    summary: "Clear guidance for safer training and recovery.",
    pages: 42,
    epub: "SPORTINJURIES/EPUB/KOBOEBBOK.epub",
    cover: "SPORTINJURIES/Prevent_Sports_Injuries_Cover_6x9.jpg",
  },
  {
    id: "adults-kingdom-rainbow",
    title: "The Kingdom Behind the Rainbow",
    author: "Wattly Voices",
    level: "B1–B2",
    summary: "A story ebook with calm pacing for older learners.",
    pages: 56,
    epub: "STROYABBYS/The_Kingdom_Behind_the_Rainbow_Enhanced.epub",
    cover: "STROYABBYS/EBOOK&PAPER/EBBOKREADY/01_The_Boy_Who_Drew_the_Edges_art.png",
  },
  {
    id: "adults-kingdom-clock",
    title: "The Kingdom Behind the Clock",
    author: "Wattly Voices",
    level: "B2–C1",
    summary: "An advanced narrative for Kindle-style reading practice.",
    pages: 64,
    epub: "THEKINGDOMEBEHINDTHECLOCK/FINALCHAPTER/READY/The_Kingdom_Behind_the_Clock_Final.epub",
    cover: "THEKINGDOMEBEHINDTHECLOCK/THECOVER/EBOOKCOVER.png",
  },
];

async function ensureFolders() {
  for (const folder of [
    "wattly",
    "wattly/covers",
    "wattly/pdfs",
    "wattly/epubs",
    "wattly/library",
  ]) {
    try {
      await cloudinary.api.create_folder(folder);
      console.log("Created", folder);
    } catch {
      console.log("Exists", folder);
    }
  }
}

async function uploadImage(localPath, publicId) {
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    folder: "wattly/covers",
    overwrite: true,
    resource_type: "image",
  });
  console.log("Cover →", result.public_id);
  return {
    publicId: result.public_id.replace(/^wattly\/covers\//, ""),
    url: result.secure_url,
  };
}

async function uploadRaw(localPath, folder, publicId) {
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    folder,
    overwrite: true,
    resource_type: "raw",
  });
  console.log("Raw →", result.public_id);
  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
}

async function main() {
  if (!process.env.CLOUDINARY_API_KEY && !process.env.CLOUDINARY_URL) {
    console.error("Missing Cloudinary credentials in .env.local");
    process.exit(1);
  }

  await ensureFolders();

  const kids = [];
  for (const book of kidsBooks) {
    const coverPath = resolve(KIDS_ROOT, "Covers", book.coverFile);
    const pdfPath = resolve(
      KIDS_ROOT,
      "Wattly_English_Childrens_Stories",
      "PDF_Books",
      book.pdfFile,
    );
    if (!existsSync(coverPath) || !existsSync(pdfPath)) {
      console.warn("Missing kids asset", book.id, coverPath, pdfPath);
      continue;
    }
    const cover = await uploadImage(coverPath, book.id);
    const pdf = await uploadRaw(
      pdfPath,
      "wattly/pdfs",
      `${book.id}.pdf`,
    );
    kids.push({
      id: book.id,
      audience: "kids",
      format: "pdf",
      title: book.title,
      author: "Wattly English",
      level: book.level,
      ages: book.ages,
      summary: book.theme,
      description: book.theme,
      pages: 10,
      coverPublicId: cover.publicId,
      coverUrl: cover.url,
      pdfPublicId: pdf.publicId,
      pdfUrl: pdf.url,
      minutes: 12,
    });
  }

  const adults = [];
  for (const book of adultBooks) {
    const coverPath = resolve(ADULT_ROOT, book.cover);
    const epubPath = resolve(ADULT_ROOT, book.epub);
    if (!existsSync(epubPath)) {
      console.warn("Missing epub", book.id, epubPath);
      continue;
    }
    let cover = { publicId: book.id, url: "" };
    if (existsSync(coverPath)) {
      cover = await uploadImage(coverPath, book.id);
    }
    const epub = await uploadRaw(
      epubPath,
      "wattly/epubs",
      `${book.id}.epub`,
    );
    adults.push({
      id: book.id,
      audience: "adults",
      format: "epub",
      title: book.title,
      author: book.author,
      level: book.level,
      summary: book.summary,
      description: book.summary,
      pages: book.pages || 40,
      coverPublicId: cover.publicId,
      coverUrl: cover.url,
      epubPublicId: epub.publicId,
      epubUrl: epub.url,
      minutes: 25,
    });
  }

  const catalog = {
    updatedAt: new Date().toISOString(),
    cloudName,
    kids,
    adults,
  };

  mkdirSync(resolve(process.cwd(), "src/lib/library"), { recursive: true });
  writeFileSync(OUT, JSON.stringify(catalog, null, 2));
  console.log(
    `Catalog written: ${kids.length} kids PDF + ${adults.length} adult EPUB → ${OUT}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
