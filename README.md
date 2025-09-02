# PDF Wallpaper Viewer

A beautiful, modern PDF viewer built with Next.js and Material-UI (MUI) designed to work as a desktop wallpaper application.

## Features

- **Modern UI**: Built with Material-UI components and responsive design
- **Theme Support**: Automatically adapts to light/dark system preferences
- **Multiple Layouts**: Single page and two-page spread views
- **Smart Navigation**: Full-height navigation buttons positioned next to PDF content
- **Overlay Mode**: Toggle between PDF view and solid background overlay
- **Query Parameter Loading**: Load PDFs from URL parameters or local files
- **Responsive Design**: Works on different screen sizes and orientations

## Usage

### Loading PDFs via URL Parameters

The app can load PDFs from query parameters in the URL:

#### Remote PDFs

```
http://localhost:3000/?file=https://example.com/document.pdf
```

#### Local PDFs (placed in public/pdfs folder)

```
http://localhost:3000/?file=document.pdf
```

### Manual File Selection

You can also use the "Open PDF" button in the control bar to select a PDF file from your local machine.

## Controls

### Navigation

- **Left/Right Buttons**: Navigate between pages
- **Single Mode**: Navigate one page at a time
- **Two-Page Mode**: Navigate two pages at a time (spread view)

### Layout Controls

- **Single/Two-Page Toggle**: Switch between single page and spread view
- **Overlay Toggle**: Show/hide a solid background overlay
- **Page Indicator**: Shows current page position

## File Structure

```
src/
├── app/
│   ├── api/pdf/route.ts    # API route for serving local PDFs
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with MUI theme
│   └── page.tsx            # Main page component
├── components/
│   ├── ClientThemeProvider.tsx  # MUI theme provider
│   ├── PdfWallpaper.tsx         # Main PDF viewer component
│   └── pdf/
│       └── ReactPdfHost.tsx     # React-PDF wrapper component
└── public/
    └── pdfs/               # Directory for local PDF files
```

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Add PDF files** (optional):
   Place PDF files in the `public/pdfs/` directory to serve them locally.

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### `/api/pdf`

- **Method**: GET
- **Parameters**: `file` - PDF filename (must be in public/pdfs directory)
- **Returns**: PDF file with proper headers
- **Security**: Only allows .pdf files

## Technical Details

- **Framework**: Next.js 15 with App Router
- **UI Library**: Material-UI (MUI) v5
- **PDF Rendering**: React-PDF with PDF.js
- **Theme**: Automatic light/dark mode based on system preference
- **Styling**: MUI's `sx` prop for component styling
- **State Management**: React hooks (useState, useCallback, useMemo)
- **File Handling**: Fetch API for remote files, Node.js fs for local files

## Browser Support

- Modern browsers with ES6+ support
- Requires JavaScript enabled
- PDF.js worker support

## License

MIT License
