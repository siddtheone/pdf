import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Wallpaper Viewer",
  description: "A beautiful PDF viewer for desktop wallpaper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientThemeProvider>
          <CssBaseline />
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
