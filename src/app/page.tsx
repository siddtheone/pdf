"use client";

import { Suspense } from "react";
import PdfWallpaper from "@/components/PdfWallpaper";
import { Skeleton } from "@/components/Skeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PdfWallpaper />
    </Suspense>
  );
}
