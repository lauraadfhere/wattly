/** Root + asset folders on Cloudinary (path prefixes). */
export const CLOUDINARY_FOLDERS = {
  root: "wattly",
  media: "wattly/media",
  pdfs: "wattly/pdfs",
  covers: "wattly/covers",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "dp5g9tinm";

export function getCloudinaryCloudName() {
  return cloudName;
}

/** Public delivery URL helper for assets under wattly/* folders. */
export function cloudinaryUrl(
  publicId: string,
  options?: {
    folder?: CloudinaryFolder;
    resourceType?: "image" | "raw" | "video" | "auto";
    transform?: string;
  },
) {
  const folder = options?.folder;
  const id = folder ? `${folder}/${publicId}` : publicId;
  const resource = options?.resourceType || "image";
  const transform = options?.transform ? `${options.transform}/` : "";
  return `https://res.cloudinary.com/${cloudName}/${resource}/upload/${transform}${id}`;
}

export function coverImageUrl(publicId: string, width = 800) {
  return cloudinaryUrl(publicId, {
    folder: CLOUDINARY_FOLDERS.covers,
    transform: `f_auto,q_auto,w_${width},c_fill,g_auto`,
  });
}

export function mediaImageUrl(publicId: string, width = 1200) {
  return cloudinaryUrl(publicId, {
    folder: CLOUDINARY_FOLDERS.media,
    transform: `f_auto,q_auto,w_${width}`,
  });
}

export function pdfUrl(publicId: string) {
  const id = publicId.endsWith(".pdf") ? publicId : `${publicId}.pdf`;
  return cloudinaryUrl(id, {
    folder: CLOUDINARY_FOLDERS.pdfs,
    resourceType: "raw",
  });
}
