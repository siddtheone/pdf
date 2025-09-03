// Google Analytics configuration
// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
export const GA_TRACKING_ID = "G-N36ERKP5Z4";

// Send custom event
export const gtagEvent = (action: string, params: string): void => {
  if (typeof window !== "undefined" && (window as Window).gtag) {
    window.gtag("event", "pdf_interaction", params);
  }
};

// Track PDF interactions
export const trackPdfAction = (
  params: "open" | "navigate prev" | "navigate next" | "overlay_toggle"
) => {
  gtagEvent("pdf_interaction", params);
};

// Declare global types
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
