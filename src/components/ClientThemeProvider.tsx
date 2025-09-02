"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: "#6366f1",
      },
      secondary: {
        main: "#ec4899",
      },
    },
    typography: {
      fontFamily: "var(--font-geist-sans), Arial, sans-serif",
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

