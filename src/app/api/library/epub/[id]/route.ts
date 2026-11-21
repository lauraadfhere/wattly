import { NextResponse } from "next/server";
import { getLibraryBook, libraryEpubSrc } from "@/lib/library";

type Params = { params: Promise<{ id: string }> };

/** Same-origin EPUB proxy — avoids blank readers when remote raw fetch fails in-browser. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const book = getLibraryBook(id);
  if (!book || book.format !== "epub") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const remote = libraryEpubSrc(book);
  if (!remote) {
    return NextResponse.json({ error: "EPUB missing" }, { status: 404 });
  }

  try {
    const upstream = await fetch(remote, {
      headers: { Accept: "application/epub+zip,application/octet-stream,*/*" },
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: 502 },
      );
    }

    const bytes = await upstream.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/epub+zip",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
