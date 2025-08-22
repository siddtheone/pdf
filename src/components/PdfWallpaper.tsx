"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { getSavedState, saveState } from "@/lib/db";
import { initGA, trackPdfAction } from "@/lib/analytics";

// Load the React-PDF host as a pure client-side dynamic import to avoid DOM usage during prerender
const ReactPdfHost = dynamic(() => import("./pdf/ReactPdfHost"), {
  ssr: false,
});

type LayoutMode = "single" | "spread";

type SavedState = {
  pdfData?: ArrayBuffer;
  lastPage?: number;
  layout?: LayoutMode;
  overlay?: boolean;
};

export default function PdfWallpaper() {
  const [pdfData, setPdfData] = useState<ArrayBuffer | undefined>(undefined);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [layout, setLayout] = useState<LayoutMode>("single");
  const [overlay, setOverlay] = useState(false);

  const onDocumentLoadSuccess = useCallback((info: { numPages: number }) => {
    setNumPages(info.numPages);
  }, []);
  const onDocumentLoadError = useCallback((error: unknown) => {
    console.error("PDF load error", error);
  }, []);

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Load saved state from IndexedDB
  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = (await getSavedState()) as SavedState | undefined;
      if (!mounted || !saved) return;
      if (saved.pdfData) setPdfData(saved.pdfData);
      if (saved.lastPage) setCurrentPage(saved.lastPage);
      if (saved.layout) setLayout(saved.layout);
      if (saved.overlay) setOverlay(saved.overlay);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist state to IndexedDB
  const persist = useCallback(
    async (next: Partial<SavedState>) => {
      const snapshot: SavedState = {
        pdfData,
        lastPage: currentPage,
        layout,
        overlay,
        ...next,
      };
      await saveState(snapshot);
    },
    [pdfData, currentPage, layout, overlay]
  );
  const goPrev = useCallback(() => {
    setCurrentPage((prev) => {
      const delta = layout === "spread" ? 2 : 1;
      const next = Math.max(1, prev - delta);
      void persist({ lastPage: next });
      trackPdfAction("navigate");
      return next;
    });
  }, [layout, persist]);

  const goNext = useCallback(() => {
    setCurrentPage((prev) => {
      const delta = layout === "spread" ? 2 : 1;
      const maxPage =
        layout === "spread" ? Math.max(1, numPages - 1) : numPages;
      const next = Math.min(maxPage, prev + delta);
      void persist({ lastPage: next });
      trackPdfAction("navigate");
      return next;
    });
  }, [layout, numPages, persist]);

  const toggleLayout = useCallback(() => {
    setLayout((prev) => {
      const next: LayoutMode = prev === "single" ? "spread" : "single";
      // Normalize current page for spread (start on odd page)
      setCurrentPage((p) => {
        const normalized = next === "spread" && p % 2 === 0 ? p - 1 : p;
        void persist({ layout: next, lastPage: normalized });
        return normalized;
      });
      trackPdfAction("layout_change");
      return next;
    });
  }, [persist]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const buffer = await file.arrayBuffer();
      setPdfData(buffer);
      setCurrentPage(1);
      if (layout === "spread") toggleLayout();
      await persist({ pdfData: buffer, lastPage: 1 });
      trackPdfAction("open");
    },
    [persist, toggleLayout, layout]
  );

  const toggleOverlay = useCallback(() => {
    setOverlay((prev) => {
      const next = !prev;
      void persist({ overlay: next });
      trackPdfAction("overlay_toggle");
      return next;
    });
  }, [persist]);

  const leftRightPages = useMemo(() => {
    const left = currentPage % 2 === 1 ? currentPage : currentPage - 1;
    const right = Math.min(numPages, left + 1);
    return { left, right };
  }, [currentPage, numPages]);

  const canPrev = useMemo(() => currentPage > 1, [currentPage]);
  const canNext = useMemo(() => {
    if (layout === "spread") return currentPage + 1 < numPages;
    return currentPage < numPages;
  }, [currentPage, layout, numPages]);

  return (
    <>
      {pdfData ? (
        <div className="flex items-stretch justify-center gap-4 py-16">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="w-12 rounded-xl disabled:opacity-30 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 bg-gradient-to-b from-fuchsia-500/20 to-sky-500/20 hover:from-fuchsia-500/30 hover:to-sky-500/30 backdrop-blur border border-foreground/15 shadow-lg text-2xl"
          >
            <span className="pointer-events-none select-none">‹</span>
          </button>

          <div
            className={`flex ${
              layout === "spread" ? "flex-row gap-4" : "flex-col"
            } items-center justify-center`}
          >
            <ReactPdfHost
              data={pdfData}
              layout={layout}
              currentPage={currentPage}
              leftRightPages={leftRightPages}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              numPages={numPages}
            />
          </div>

          <button
            onClick={goNext}
            disabled={!canNext}
            className="w-12 rounded-xl disabled:opacity-30 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 bg-gradient-to-b from-sky-500/20 to-fuchsia-500/20 hover:from-sky-500/30 hover:to-fuchsia-500/30 backdrop-blur border border-foreground/15 shadow-lg text-2xl"
          >
            <span className="pointer-events-none select-none">›</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-2 text-base">Open a PDF to get started</div>
          <div className="text-sm">
            Your last document and position will be remembered
          </div>
        </div>
      )}

      {overlay && (
        <div
          className={`fixed inset-0 ${
            overlay && "bg-gray-200 dark:bg-gray-800"
          }`}
        />
      )}

      {/* Bottom center control bar */}
      <div className="pointer-events-auto fixed bottom-5 left-1/2 z-20 -translate-x-1/2 opacity-40 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-background/80 px-3 py-2 shadow-xl backdrop-blur-md">
          <label className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-fuchsia-500/20 to-sky-500/20 px-3 py-1.5 text-sm hover:from-fuchsia-500/30 hover:to-sky-500/30 cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <span>Open PDF</span>
          </label>
          <button
            onClick={toggleLayout}
            disabled={numPages === 1}
            className="rounded-md bg-gradient-to-br disabled:opacity-30 from-emerald-500/20 to-cyan-500/20 px-3 py-1.5 text-sm hover:from-emerald-500/30 hover:to-cyan-500/30"
          >
            {layout === "single" ? "Two-Page" : "One-Page"}
          </button>
          <button
            onClick={toggleOverlay}
            className="rounded-md bg-gradient-to-br from-amber-500/20 to-pink-500/20 px-3 py-1.5 text-sm hover:from-amber-500/30 hover:to-pink-500/30"
          >
            {overlay ? "Hide Overlay" : "Show Overlay"}
          </button>
          {pdfData && (
            <div className="ml-2 rounded-full border border-foreground/10 bg-background/60 px-2 py-1 text-xs">
              {layout === "single" ? (
                <span>
                  Page {currentPage} of {numPages}
                </span>
              ) : (
                <span>
                  Pages {leftRightPages.left}
                  {leftRightPages.right <= numPages
                    ? `–${leftRightPages.right}`
                    : ""}{" "}
                  of {numPages}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
