"use client";

import { Suspense } from "react";
import PdfWallpaper from "@/components/PdfWallpaper";

export const dynamic = "force-dynamic";

function PdfWallpaperWrapper() {
  return <PdfWallpaper />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfWallpaperWrapper />
    </Suspense>
  );
}
