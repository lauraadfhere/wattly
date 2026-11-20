/**
 * Creates Wattly media folders on Cloudinary:
 *   wattly / wattly/media / wattly/pdfs / wattly/covers
 *
 * Usage:
 *   node --env-file=.env.local scripts/ensure-cloudinary-folders.mjs
 */
import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "dp5g9tinm";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config(true);
} else {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.error(
      "Missing CLOUDINARY_URL or CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env.local",
    );
    process.exit(1);
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const folders = ["wattly", "wattly/media", "wattly/pdfs", "wattly/covers"];

async function ensureFolder(path) {
  try {
    await cloudinary.api.create_folder(path);
    console.log(`Created folder: ${path}`);
  } catch (err) {
    const message = err?.error?.message || err?.message || String(err);
    if (/already exists|Folder already exists/i.test(message)) {
      console.log(`Folder exists: ${path}`);
      return;
    }
    // Some accounts return 400 with "already exists" nested differently
    if (err?.http_code === 400 && /exist/i.test(message)) {
      console.log(`Folder exists: ${path}`);
      return;
    }
    throw err;
  }
}

async function seedCoverPlaceholders() {
  const covers = [
    "starter-a1",
    "conversation-a2",
    "business-b1",
    "exam-b2",
  ];

  for (const id of covers) {
    const publicId = `wattly/covers/${id}`;
    try {
      await cloudinary.api.resource(publicId, { resource_type: "image" });
      console.log(`Cover exists: ${publicId}`);
      continue;
    } catch {
      // upload a generated placeholder
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#000ea8"/>
          <stop offset="100%" stop-color="#000A5E"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#g)"/>
      <text x="80" y="340" fill="#ffc933" font-family="Arial,sans-serif" font-size="64" font-weight="700">Wattly</text>
      <text x="80" y="420" fill="#ffffff" font-family="Arial,sans-serif" font-size="42">${id}</text>
    </svg>`;

    const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    await cloudinary.uploader.upload(dataUri, {
      folder: "wattly/covers",
      public_id: id,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`Seeded cover: ${publicId}`);
  }
}

async function main() {
  for (const folder of folders) {
    await ensureFolder(folder);
  }
  await seedCoverPlaceholders();
  console.log("Cloudinary Wattly folders ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
