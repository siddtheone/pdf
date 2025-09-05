# PDF Wallpaper Viewer

A minimal PDF viewer built with Next.js and Material-UI designed for desktop wallpaper use. **All PDF processing happens locally in your browser** - no files are sent to external servers.

## Features

- **Local Processing**: PDFs are rendered entirely in your browser using PDF.js
- **Privacy First**: No files uploaded to servers - everything stays on your device
- **Clean UI**: Material-UI components with automatic light/dark theme
- **PDF Navigation**: Previous/next page controls
- **Local & Remote Files**: Load PDFs from URLs or local file selection
- **Overlay Mode**: Toggle solid background overlay
- **Zoom Controls**: Scale PDF pages up/down
- **Analytics**: Google Analytics integration (configurable)

## Usage

### Remote PDFs

```
http://localhost:3000/?file=https://example.com/document.pdf
```

### Local Files

Use the "Open PDF" button to select files from your computer.

## Controls

- **Navigation**: Left/right arrow buttons
- **Overlay**: Show/hide solid background
- **Zoom**: Scale PDF pages (0.5x to 2x)
- **Page Counter**: Current page display

## Setup

```bash
npm install
npm run dev
```

## Configuration

Update `src/lib/analytics.ts` with your Google Analytics ID to enable tracking.

## Tech Stack

- Next.js 15 (App Router)
- Material-UI v5
- React-PDF
- TypeScript
