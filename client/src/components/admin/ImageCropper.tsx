"use client";

// Crop + zoom editor: drag to reposition, wheel / slider / pinch to zoom.
// The frame uses the same aspect ratio the website displays, so what you see is what gets shown.
// Renders as an overlay inside the current drawer (not a portal) so it stays interactive
// while the drawer's modal focus trap is active.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/admin/ui";

const MAX_ZOOM = 4;

type Props = {
  src: string; // object URL or remote URL
  /** Width / height of the result, e.g. 1 for square, 1792 / 1024 for the team banner */
  aspect?: number;
  /** Maximum output width in px (never upscales beyond the source resolution) */
  outputWidth?: number;
  /** "circle": dim outside a circle (avatars). "square": dashed centre square marking a secondary crop. */
  guide?: "circle" | "square" | "none";
  guideLabel?: string;
  /** Allow zooming out until the whole photo fits; empty space is filled with the photo's edge colour */
  allowFit?: boolean;
  onCancel: () => void;
  onDone: (file: File) => void;
};

// Background colour of the photo = median colour of all its border pixels (robust against
// a logo or shadow in one corner) — used to fill empty space when zoomed out
function edgeColor(img: HTMLImageElement) {
  try {
    const N = 32;
    const c = document.createElement("canvas");
    c.width = c.height = N;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, N, N);
    const data = ctx.getImageData(0, 0, N, N).data;
    const border: number[][] = [];
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++)
        if (x === 0 || y === 0 || x === N - 1 || y === N - 1) {
          const i = (y * N + x) * 4;
          border.push([data[i], data[i + 1], data[i + 2]]);
        }
    const median = [0, 1, 2].map((ch) => {
      const v = border.map((p) => p[ch]).sort((a, b) => a - b);
      return v[Math.floor(v.length / 2)];
    });
    return `rgb(${median.join(",")})`;
  } catch {
    return "#ffffff"; // cross-origin image without CORS: fall back to white
  }
}

export function ImageCropper({
  src,
  aspect = 1,
  outputWidth = 1600,
  guide = "circle",
  guideLabel,
  allowFit = false,
  onCancel,
  onDone,
}: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Frame size: as large as fits the drawer (and small phones), in the requested aspect
  const [frame] = useState(() => {
    const maxW = typeof window !== "undefined" ? Math.min(460, window.innerWidth - 48) : 460;
    const maxH = 340;
    const w = Math.min(maxW, maxH * aspect);
    return { w: Math.round(w), h: Math.round(w / aspect) };
  });
  const VW = frame.w;
  const VH = frame.h;

  // zoom + offset live in one state object, mirrored in a ref so rapid wheel/pinch
  // events always build on the latest value instead of a stale render
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const viewState = useRef(view);
  const { zoom } = view;
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

  const fill = useMemo(() => (img ? edgeColor(img) : "#ffffff"), [img]);

  // zoom = 1 means the photo just covers the frame; below 1 (if allowed) it fits inside it
  const coverScale = img ? Math.max(VW / img.naturalWidth, VH / img.naturalHeight) : 1;
  const fitScale = img ? Math.min(VW / img.naturalWidth, VH / img.naturalHeight) : 1;
  const minZoom = allowFit ? fitScale / coverScale : 1;
  const scale = coverScale * zoom;

  // Keep the photo either covering the frame, or (when smaller) inside it
  const clamp = useCallback(
    (x: number, y: number, z: number) => {
      if (!img) return { x, y };
      const s = coverScale * z;
      const maxX = Math.abs(img.naturalWidth * s - VW) / 2;
      const maxY = Math.abs(img.naturalHeight * s - VH) / 2;
      return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
    },
    [img, coverScale, VW, VH]
  );

  const commit = useCallback((next: { zoom: number; x: number; y: number }) => {
    viewState.current = next;
    setView(next);
  }, []);

  /**
   * Zoom to `nextZoom`, keeping the image point under (px, py) fixed.
   * px/py are relative to the frame centre; omit them to zoom around the centre.
   */
  const zoomTo = useCallback(
    (nextZoom: number, px = 0, py = 0) => {
      const cur = viewState.current;
      const z = Math.min(MAX_ZOOM, Math.max(minZoom, nextZoom));
      const ratio = z / cur.zoom;
      const pos = clamp(px - (px - cur.x) * ratio, py - (py - cur.y) * ratio, z);
      commit({ zoom: z, ...pos });
    },
    [clamp, commit, minZoom]
  );

  // Pointer position relative to the frame centre
  const fromCenter = (clientX: number, clientY: number) => {
    const r = viewRef.current!.getBoundingClientRect();
    return { px: clientX - r.left - r.width / 2, py: clientY - r.top - r.height / 2 };
  };

  // Wheel / trackpad zoom, proportional to scroll distance so both a mouse wheel
  // (big steps) and a trackpad (many tiny steps) feel smooth
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // lines → px
      const factor = Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.002)); // ctrlKey = trackpad pinch
      const { px, py } = fromCenter(e.clientX, e.clientY);
      zoomTo(viewState.current.zoom * factor, px, py);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomTo, img]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const cur = viewState.current;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: cur.zoom };
      drag.current = null;
    } else {
      drag.current = { x: e.clientX, y: e.clientY, ox: cur.x, oy: cur.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const { px, py } = fromCenter((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomTo(pinch.current.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist), px, py);
    } else if (drag.current) {
      const d = drag.current;
      const z = viewState.current.zoom;
      commit({ zoom: z, ...clamp(d.ox + e.clientX - d.x, d.oy + e.clientY - d.y, z) });
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
      // Output at the source's real resolution (no upscaling), capped at outputWidth
      const outW = Math.max(1, Math.min(outputWidth, Math.round(VW / scale)));
      const outH = Math.round(outW / aspect);
      const k = outW / VW;
      const dispW = img.naturalWidth * scale;
      const dispH = img.naturalHeight * scale;

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, outW, outH);
      ctx.drawImage(img, (VW / 2 + view.x - dispW / 2) * k, (VH / 2 + view.y - dispH / 2) * k, dispW * k, dispH * k);

      const blob =
        (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.88))) ??
        (await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png")));
      if (!blob) throw new Error("Could not export image");
      const ext = blob.type === "image/webp" ? "webp" : "png";
      onDone(new File([blob], `photo.${ext}`, { type: blob.type }));
    } catch {
      setError(true);
      setSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white" data-lenis-prevent>
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-base font-semibold text-slate-900">Adjust photo</h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Drag to reposition. Scroll, pinch or use the slider to zoom. The frame matches how it appears on the website.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto bg-slate-50 px-6 py-8">
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
              className="relative shrink-0 cursor-grab touch-none select-none overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-200 active:cursor-grabbing"
              style={{ width: VW, height: VH, background: fill }}
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
                  transform: `translate(calc(-50% + ${view.x}px), calc(-50% + ${view.y}px))`,
                }}
              />

              {/* Rule-of-thirds grid */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_33.1%,rgba(255,255,255,0.3)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,0.3)_66.6%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.1%,rgba(255,255,255,0.3)_33.3%,transparent_33.5%,transparent_66.5%,rgba(255,255,255,0.3)_66.6%,transparent_66.8%)]" />

              {guide === "circle" && (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80"
                  style={{ width: Math.min(VW, VH), height: Math.min(VW, VH), boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.7)" }}
                />
              )}
              {guide === "square" && (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-dashed border-white/90 shadow-[0_0_0_1px_rgba(15,23,42,0.35)]"
                  style={{ width: Math.min(VW, VH), height: Math.min(VW, VH) }}
                >
                  {guideLabel && (
                    <span className="absolute left-1 top-1 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {guideLabel}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3" style={{ width: Math.max(260, Math.min(VW, 340)) }}>
              <button type="button" onClick={() => zoomTo(zoom / 1.2)} className="text-slate-500 hover:text-slate-900" aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <input
                type="range"
                min={minZoom}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => zoomTo(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-600"
                aria-label="Zoom"
              />
              <button type="button" onClick={() => zoomTo(zoom * 1.2)} className="text-slate-500 hover:text-slate-900" aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => commit({ zoom: 1, x: 0, y: 0 })}
                className="ml-1 text-slate-500 hover:text-slate-900"
                aria-label="Reset"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            {allowFit && zoom <= 1 && (
              <p className="text-xs text-slate-500">Empty space is filled with the photo&apos;s background colour.</p>
            )}
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
