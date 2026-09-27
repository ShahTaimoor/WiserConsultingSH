"use client";

// Crop + zoom editor: drag to reposition, wheel / slider / pinch to zoom.
// Renders as an overlay inside the current drawer (not a portal) so it stays interactive
// while the drawer's modal focus trap is active.

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/admin/ui";

const VIEW = 300; // crop viewport size in px (square)
const MAX_ZOOM = 4;

type Props = {
  src: string; // object URL or remote URL
  output?: number; // output size in px (square)
  round?: boolean; // show a circular guide (for avatars)
  onCancel: () => void;
  onDone: (file: File) => void;
};

export function ImageCropper({ src, output = 800, round = true, onCancel, onDone }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  // Load the image (crossOrigin so already-uploaded Cloudinary photos can be re-cropped)
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => setImg(image);
    image.onerror = () => setError(true);
    image.src = src;
  }, [src]);

  // Scale at which the image just covers the viewport
  const baseScale = img ? Math.max(VIEW / img.naturalWidth, VIEW / img.naturalHeight) : 1;
  const scale = baseScale * zoom;

  // Keep the image covering the whole viewport (no empty edges)
  const clamp = useCallback(
    (x: number, y: number, z = zoom) => {
      if (!img) return { x, y };
      const s = baseScale * z;
      const maxX = Math.max(0, (img.naturalWidth * s - VIEW) / 2);
      const maxY = Math.max(0, (img.naturalHeight * s - VIEW) / 2);
      return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
    },
    [img, baseScale, zoom]
  );

  const applyZoom = useCallback(
    (next: number) => {
      const z = Math.min(MAX_ZOOM, Math.max(1, next));
      setZoom(z);
      setOffset((o) => clamp(o.x, o.y, z));
    },
    [clamp]
  );

  // Mouse wheel zoom (native listener so we can preventDefault page scroll)
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom, zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
      drag.current = null;
    } else {
      drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      applyZoom(pinch.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist));
    } else if (drag.current) {
      const d = drag.current;
      setOffset(clamp(d.ox + e.clientX - d.x, d.oy + e.clientY - d.y));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const handleDone = async () => {
    if (!img) return;
    setSaving(true);
    try {
      // Visible square in source-image pixels
      const size = VIEW / scale;
      const sx = img.naturalWidth / 2 - (VIEW / 2 + offset.x) / scale;
      const sy = img.naturalHeight / 2 - (VIEW / 2 + offset.y) / scale;
      const out = Math.min(output, Math.round(size)) || output;

      const canvas = document.createElement("canvas");
      canvas.width = out;
      canvas.height = out;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, size, size, 0, 0, out, out);

      const blob =
        (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.88))) ??
        (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png")));
      if (!blob) throw new Error("Could not export image");
      const ext = blob.type === "image/webp" ? "webp" : "png";
      onDone(new File([blob], `profile.${ext}`, { type: blob.type }));
    } catch {
      setError(true);
      setSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white" data-lenis-prevent>
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-base font-semibold text-slate-900">Adjust photo</h3>
        <p className="mt-0.5 text-sm text-slate-500">Drag to reposition. Scroll, pinch or use the slider to zoom.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-slate-50 px-6 py-8">
        {error ? (
          <p className="text-sm text-red-600">This image could not be loaded for cropping. Try choosing the file again.</p>
        ) : !img ? (
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        ) : (
          <>
            <div
              ref={viewRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative cursor-grab touch-none select-none overflow-hidden rounded-lg bg-slate-900 active:cursor-grabbing"
              style={{ width: VIEW, height: VIEW }}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                crossOrigin="anonymous"
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                style={{
                  width: img.naturalWidth * scale,
                  height: img.naturalHeight * scale,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
              />
              {/* Guide: dim everything outside the circle / rule-of-thirds grid */}
              {round && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/80"
                  style={{ boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.7)" }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_33.1%,rgba(255,255,255,0.25)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,0.25)_66.6%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.1%,rgba(255,255,255,0.25)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,0.25)_66.6%,transparent_66.8%)]" />
            </div>

            <div className="flex w-full max-w-[300px] items-center gap-3">
              <button type="button" onClick={() => applyZoom(zoom / 1.2)} className="text-slate-500 hover:text-slate-900" aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min={1}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => applyZoom(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-600"
                aria-label="Zoom"
              />
              <button type="button" onClick={() => applyZoom(zoom * 1.2)} className="text-slate-500 hover:text-slate-900" aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                }}
                className="ml-1 text-slate-500 hover:text-slate-900"
                aria-label="Reset"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="button" onClick={handleDone} loading={saving} disabled={!img || error}>
          Apply
        </Button>
      </div>
    </div>
  );
}
