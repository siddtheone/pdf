"use client";

import { Suspense } from "react";
import PdfWallpaper from "@/components/PdfWallpaper";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfWallpaper />
    </Suspense>
  );
}
