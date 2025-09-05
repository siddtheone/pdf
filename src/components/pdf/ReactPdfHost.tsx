"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef } from "react";
import { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import "./ReactPdfHost.css";
import { Skeleton as SkeletonMui } from "@mui/material";

type Props = {
  file?: ArrayBuffer | string;
  currentPage: number;
  onLoadSuccess: (info: { numPages: number }) => void;
  onLoadError?: (error: unknown) => void;
  scale: number;
};

export default function ReactPdfHost({
  file,
  currentPage,
  onLoadSuccess,
  onLoadError,
  scale,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const difRef = useRef<HTMLDivElement>(null);

  const onLoad: OnDocumentLoadSuccess = (rest) => {
    onLoadSuccess(rest);
  };

  useEffect(() => {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
    } catch {}
  }, []);

  return (
    <Document
      file={file}
      onLoadSuccess={onLoad}
      onLoadError={onLoadError}
      loading={
        <SkeletonMui
          variant="rectangular"
          width="40%"
          height={800}
          sx={{ margin: "0 auto" }}
        />
      }
    >
      <Page
        key={currentPage}
        pageNumber={currentPage}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        inputRef={difRef}
        canvasRef={canvasRef}
        scale={scale}
        className="root"
      />
    </Document>
  );
}
