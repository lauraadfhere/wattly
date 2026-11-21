import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getLibraryBook, libraryPdfSrc } from "@/lib/library";

type Params = { params: Promise<{ id: string }> };

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config(true);
    return true;
  }
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name:
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME ||
        "dp5g9tinm",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return true;
  }
  return false;
}

async function fetchBytes(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.arrayBuffer();
}

/** Same-origin PDF proxy with inline disposition + signed Cloudinary fallback. */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const book = getLibraryBook(id);
  if (!book || book.format !== "pdf") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const publicId =
    book.pdfPublicId?.replace(/^\/+/, "") ||
    `wattly/pdfs/${book.id}.pdf`;
  const remote = libraryPdfSrc(book);
  const candidates: string[] = [];

  if (remote) candidates.push(remote);

  if (configureCloudinary()) {
    try {
      candidates.push(
        cloudinary.url(publicId, {
          resource_type: "raw",
          type: "upload",
          sign_url: true,
          secure: true,
        }),
      );
      candidates.push(
        cloudinary.url(publicId, {
          resource_type: "raw",
          type: "authenticated",
          sign_url: true,
          secure: true,
        }),
      );
      candidates.push(
        cloudinary.utils.private_download_url(
          publicId.replace(/\.pdf$/i, ""),
          "pdf",
          { resource_type: "raw", type: "upload", attachment: false },
        ),
      );
    } catch {
      // signed helpers optional
    }
  }

  for (const url of candidates) {
    try {
      const bytes = await fetchBytes(url);
      if (bytes.byteLength < 100) continue;
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${book.id}.pdf"`,
          "Cache-Control": "public, max-age=3600",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // try next candidate
    }
  }

  return NextResponse.json(
    { error: "PDF unavailable. Re-upload with yarn library:upload." },
    { status: 502 },
  );
}
