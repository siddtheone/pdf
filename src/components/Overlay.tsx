import { Box, useTheme } from "@mui/material";

export function Overlay({ overlay }: { overlay: boolean }) {
  const theme = useTheme();

  return overlay ? (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor:
          theme.palette.mode === "dark" ? "grey.800" : "grey.200",
        zIndex: 1,
      }}
    />
  ) : null;
}
