"use client";

import PdfWallpaper from "@/components/PdfWallpaper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PDF Wallpaper",
  description: "PDF Wallpaper by Siddharth",
};

export default function Home() {
  return <PdfWallpaper />;
}
