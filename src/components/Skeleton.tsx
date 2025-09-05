import { Skeleton as MuiSkeleton } from "@mui/material";

export function Skeleton() {
  return (
    <MuiSkeleton
      animation="pulse"
      variant="rectangular"
      width="100%"
      height="100%"
    />
  );
}
