import { renderOgImage } from "@/lib/ogImage";

export const alt = "Tech Wiser Consulting — Software House in Peshawar, Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
