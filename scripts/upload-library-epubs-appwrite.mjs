/**
 * Ensures Appwrite Storage bucket `library_epubs` and uploads adult EPUB files.
 * Patches src/lib/library/catalog.json with epubFileId / epubBucketId.
 *
 * Usage: node --env-file=.env.local scripts/upload-library-epubs-appwrite.mjs
 */
import { Client, Storage, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const BUCKET_ID = process.env.APPWRITE_LIBRARY_EPUBS_BUCKET || "library_epubs";

const ADULT_ROOT = resolve("C:/Users/DELL/Desktop/elspith/BOOKSONLINE");
const CATALOG = resolve(process.cwd(), "src/lib/library/catalog.json");

const adultBooks = [
  {
    id: "adults-babbylon",
    epub: "Babbylon/EPUB/Babbylon.epub",
  },
  {
    id: "adults-do-not-click",
    epub: "DONOTCLICK/ebook/EPUB/EBBOK.epub",
  },
  {
    id: "adults-sports-injuries",
    epub: "SPORTINJURIES/EPUB/KOBOEBBOK.epub",
  },
  {
    id: "adults-kingdom-rainbow",
    epub: "STROYABBYS/The_Kingdom_Behind_the_Rainbow_Enhanced.epub",
  },
  {
    id: "adults-kingdom-clock",
    epub: "THEKINGDOMEBEHINDTHECLOCK/FINALCHAPTER/READY/The_Kingdom_Behind_the_Clock_Final.epub",
  },
];

if (!endpoint || !projectId || !apiKey) {
  console.error("Missing Appwrite env (endpoint / project / APPWRITE_API_KEY).");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const storage = new Storage(client);

async function ensureBucket() {
  try {
    await storage.getBucket({ bucketId: BUCKET_ID });
    console.log(`Bucket exists: ${BUCKET_ID}`);
  } catch {
    await storage.createBucket({
      bucketId: BUCKET_ID,
      name: "Library EPUBs",
      // Server SDK + API key downloads; keep files private from clients.
      permissions: [Permission.read(Role.any())],
      fileSecurity: false,
      enabled: true,
      maximumFileSize: 50 * 1024 * 1024,
      allowedFileExtensions: ["epub"],
      compression: "none",
      encryption: false,
      antivirus: false,
    });
    console.log(`Created bucket: ${BUCKET_ID}`);
  }
}

async function uploadEpub(bookId, filePath) {
  const file = InputFile.fromPath(filePath, `${bookId}.epub`);
  try {
    await storage.getFile({ bucketId: BUCKET_ID, fileId: bookId });
    await storage.deleteFile({ bucketId: BUCKET_ID, fileId: bookId });
    console.log(`Replacing existing file: ${bookId}`);
  } catch {
    // new file
  }
  const created = await storage.createFile({
    bucketId: BUCKET_ID,
    fileId: bookId,
    file,
    permissions: [Permission.read(Role.any())],
  });
  return created.$id || bookId;
}

async function main() {
  await ensureBucket();

  const uploaded = {};
  for (const book of adultBooks) {
    const epubPath = resolve(ADULT_ROOT, book.epub);
    if (!existsSync(epubPath)) {
      console.warn("Missing epub", book.id, epubPath);
      continue;
    }
    const fileId = await uploadEpub(book.id, epubPath);
    uploaded[book.id] = fileId;
    console.log(`Uploaded ${book.id} → ${BUCKET_ID}/${fileId}`);
  }

  if (!existsSync(CATALOG)) {
    console.error("Catalog missing:", CATALOG);
    process.exit(1);
  }

  const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
  catalog.updatedAt = new Date().toISOString();
  catalog.epubBucketId = BUCKET_ID;
  catalog.adults = (catalog.adults || []).map((entry) => {
    const fileId = uploaded[entry.id];
    if (!fileId) return entry;
    return {
      ...entry,
      epubBucketId: BUCKET_ID,
      epubFileId: fileId,
    };
  });

  writeFileSync(CATALOG, JSON.stringify(catalog, null, 2));
  console.log(
    `Catalog patched with ${Object.keys(uploaded).length} Appwrite EPUB file ids → ${CATALOG}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
