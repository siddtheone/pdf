import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/analytics";

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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              debug_mode: ${
                process.env.NODE_ENV === "development" ? "true" : "false"
              },
              page_title: "Local PDF Viewer",
              page_location: window.location.href,
            });
          }
        `}
      </Script>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientThemeProvider>
          <CssBaseline />
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
