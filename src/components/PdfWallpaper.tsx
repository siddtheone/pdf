"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { gtagEvent, trackPdfAction } from "@/lib/analytics";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Container,
} from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  Visibility,
  VisibilityOff,
  FileOpen,
} from "@mui/icons-material";
import { Notice } from "./Notice";
import { Overlay } from "./Overlay";
import { Help } from "./Help";

// Load the React-PDF host as a pure client-side dynamic import
const ReactPdfHost = dynamic(() => import("./pdf/ReactPdfHost"), {
  ssr: false,
});

export default function PdfWallpaper() {
  const searchParams = useSearchParams();

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [overlay, setOverlay] = useState<boolean>(false);
  const [localPdfData, setLocalPdfData] = useState<ArrayBuffer | null>(null);
  const [scale, setScale] = useState<number>(1);

  // Get PDF URL from query parameter (only for hosted files, not local files)
  const queryPdfUrl = searchParams.get("file");
  // Only use URL if it's a valid HTTP/HTTPS URL, not a file:// URL
  const pdfUrl =
    queryPdfUrl &&
    (queryPdfUrl.startsWith("http://") || queryPdfUrl.startsWith("https://"))
      ? queryPdfUrl
      : undefined;

  const onDocumentLoadSuccess = useCallback((info: { numPages: number }) => {
    setNumPages(info.numPages);
  }, []);

  const onDocumentLoadError = useCallback((error: unknown) => {
    gtagEvent("error", "PDF load error");
    console.error("PDF load error", error);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentPage((prev) => {
      const next = Math.max(1, prev - 1);
      trackPdfAction("navigate prev");
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrentPage((prev) => {
      const next = Math.min(numPages, prev + 1);
      trackPdfAction("navigate next");
      return next;
    });
  }, [numPages]);

  const toggleOverlay = useCallback(() => {
    setOverlay((prev) => {
      const next = !prev;
      trackPdfAction("overlay_toggle");
      return next;
    });
  }, []);

  return (
    <>
      {/* Privacy Notice */}
      <Notice />

      {/* Overlay */}
      <Overlay overlay={overlay} />

      {/* Main content */}
      {pdfUrl || localPdfData ? (
        <Container
          maxWidth="xl"
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            overflow: "hidden",
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
            padding: 0,
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={goPrev}
            disabled={currentPage === 1}
            sx={{
              borderRadius: 3,
              justifySelf: "stretch",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: 3,
            }}
          >
            <NavigateBefore sx={{ fontSize: 32 }} />
          </IconButton>
          <Box sx={{ maxHeight: "90vh", overflowY: "auto" }}>
            <ReactPdfHost
              file={localPdfData || pdfUrl}
              currentPage={currentPage}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              scale={scale}
            />
          </Box>
          <IconButton
            onClick={goNext}
            disabled={currentPage === numPages}
            sx={{
              borderRadius: 3,
              justifySelf: "stretch",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: 3,
            }}
          >
            <NavigateNext sx={{ fontSize: 32 }} />
          </IconButton>
        </Container>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              PDF Wallpaper Viewer
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {queryPdfUrl && queryPdfUrl.startsWith("file://")
                ? "Local file paths are not supported in URLs. Please use the 'Open PDF' button to select a local file."
                : "Add a PDF file to the URL query parameter or use the 'Open PDF' button to get started"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Example: ?file=https://example.com/document.pdf
            </Typography>
          </Paper>
        </Container>
      )}

      {/* Control bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          opacity: 0.5,
          transition: "opacity 0.2s ease-in-out",
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        <Paper
          elevation={8}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            padding: 1,
            borderRadius: 3,
            backdropFilter: "blur(8px)",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<FileOpen />}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "application/pdf";
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setScale(1);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    setLocalPdfData(arrayBuffer);
                    trackPdfAction("open");
                  };
                  reader.readAsArrayBuffer(file);
                }
              };
              input.click();
            }}
          >
            Open PDF
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={!overlay ? <Visibility /> : <VisibilityOff />}
            onClick={toggleOverlay}
          >
            {!overlay ? "Show Overlay" : "Hide Overlay"}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            disabled={scale === 2}
            onClick={() => setScale(Math.min(2, scale + 0.1))}
          >
            Zoom +
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            disabled={scale === 0.5}
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          >
            Zoom -
          </Button>

          <Help />

          {(pdfUrl || localPdfData) && `Page ${currentPage} of ${numPages}`}
        </Paper>
      </Box>
    </>
  );
}
