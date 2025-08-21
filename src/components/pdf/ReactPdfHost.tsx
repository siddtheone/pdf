"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useMemo } from "react";

type LayoutMode = "single" | "spread";

type Props = {
  data?: ArrayBuffer;
  layout: LayoutMode;
  currentPage: number;
  leftRightPages: { left: number; right: number };
  onLoadSuccess: (info: { numPages: number }) => void;
  onLoadError?: (error: unknown) => void;
  numPages?: number;
};

export default function ReactPdfHost({
  data,
  layout,
  currentPage,
  leftRightPages,
  onLoadSuccess,
  onLoadError,
  numPages,
}: Props) {
  useEffect(() => {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
    } catch {}
  }, []);

  // Prefer Blob over ArrayBuffer to avoid detached buffer issues on re-renders
  const fileBlob = useMemo(() => (data ? new Blob([data]) : undefined), [data]);

  if (!data) return null;

  return (
    <Document
      file={fileBlob}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading={<div className="text-sm opacity-70">Loading…</div>}
    >
      {layout === "single" ? (
        <Page
          key={currentPage}
          pageNumber={currentPage}
          className="shadow-xl rounded-lg overflow-hidden"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={undefined}
          height={undefined}
          scale={1.5}
        />
      ) : (
        <div className="flex flex-row items-center justify-center gap-4">
          <Page
            key={leftRightPages.left}
            pageNumber={leftRightPages.left}
            className="shadow-xl rounded-lg overflow-hidden"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={undefined}
            height={undefined}
            scale={1.5}
          />
          {!!numPages && leftRightPages.right <= numPages && (
            <Page
              key={leftRightPages.right}
              pageNumber={leftRightPages.right}
              className="shadow-xl rounded-lg overflow-hidden"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={undefined}
              height={undefined}
              scale={1.5}
            />
          )}
        </div>
      )}
    </Document>
  );
}
