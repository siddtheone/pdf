import { Alert, Typography, Collapse } from "@mui/material";
import { useState } from "react";

export function Notice() {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  return showPrivacyNotice ? (
    <Collapse in={showPrivacyNotice}>
      <Alert
        severity="info"
        onClose={() => setShowPrivacyNotice(false)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="body2">
          This application tracks anonymous usage data for analytics purposes.
          No personal information or PDF content is collected. By using this
          application, you consent to this data collection.
        </Typography>
      </Alert>
    </Collapse>
  ) : null;
}
