import { NextResponse } from "next/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite/server";
import { getLibraryBook, libraryEpubSrc } from "@/lib/library";

type Params = { params: Promise<{ id: string }> };

function epubResponse(bytes: ArrayBuffer) {
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/epub+zip",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function fetchFromAppwrite(bucketId: string, fileId: string) {
  if (!process.env.APPWRITE_API_KEY) return null;
  try {
    const { storage } = createAdminClient();
    const bytes = await storage.getFileDownload({ bucketId, fileId });
    if (!bytes || bytes.byteLength < 100) return null;
    return bytes;
  } catch {
    return null;
  }
}

async function fetchFromRemote(remote: string) {
  const upstream = await fetch(remote, {
    headers: { Accept: "application/epub+zip,application/octet-stream,*/*" },
  });
  if (!upstream.ok) {
    throw new Error(`Upstream ${upstream.status}`);
  }
  const bytes = await upstream.arrayBuffer();
  if (bytes.byteLength < 100) {
    throw new Error("Empty EPUB");
  }
  return bytes;
}

/** Same-origin EPUB proxy — Appwrite Storage first, Cloudinary URL fallback. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const book = getLibraryBook(id);
  if (!book || book.format !== "epub") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bucketId =
    book.epubBucketId || appwriteConfig.buckets.libraryEpubs;
  const fileId = book.epubFileId || book.id;

  // Prefer Appwrite Storage (catalog file id, or stable book id after upload).
  const fromStorage = await fetchFromAppwrite(bucketId, fileId);
  if (fromStorage) return epubResponse(fromStorage);

  const remote = libraryEpubSrc(book);
  if (!remote) {
    return NextResponse.json({ error: "EPUB missing" }, { status: 404 });
  }

  try {
    const bytes = await fetchFromRemote(remote);
    return epubResponse(bytes);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
