// Google Analytics configuration
// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
export const GA_TRACKING_ID = "G-XXXXXXXXXX";

// Initialize Google Analytics
export const initGA = () => {
  if (
    typeof window !== "undefined" &&
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  ) {
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_TRACKING_ID, {
    page_title: "PDF Wallpaper",
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (
    typeof window !== "undefined" &&
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  ) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag(
      "config",
      GA_TRACKING_ID,
      {
        page_path: url,
      }
    );
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (
    typeof window !== "undefined" &&
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  ) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      action,
      {
        event_category: category,
        event_label: label,
        value: value,
      }
    );
  }
};

// Track PDF interactions
export const trackPdfAction = (
  action: "open" | "navigate" | "layout_change" | "overlay_toggle"
) => {
  trackEvent(action, "pdf_interaction", action);
};

// Declare global types
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
