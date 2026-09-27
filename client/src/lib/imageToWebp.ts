// Resize an image in the browser and re-encode it as WebP before upload.
// A 4 MB phone photo usually ends up around 100–300 KB, which makes saving much faster.
// GIFs are left untouched (canvas would drop the animation); the server still stores them as WebP.

export async function imageToWebp(
  file: File,
  { maxWidth, maxHeight, quality = 0.85 }: { maxWidth: number; maxHeight: number; quality?: number }
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    // Some older browsers ignore the WebP request and return PNG; fall back to the original then
    if (!blob || blob.type !== "image/webp") return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  } catch {
    return file; // Could not decode (e.g. unsupported format) — upload the original
  }
}

export const IMAGE_SIZES = {
  project: { maxWidth: 1600, maxHeight: 1000 },
  avatar: { maxWidth: 800, maxHeight: 800 },
  logo: { maxWidth: 800, maxHeight: 300 },
} as const;
