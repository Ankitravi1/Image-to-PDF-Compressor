# Image to PDF Converter

A lightweight, local-only web app to convert images into a single PDF. No external services are used.

## Why this app?

Many people compress images or convert images to PDF using online websites. That often means uploading personal files to a third-party server where privacy is uncertain. This app runs locally in your browser and processes everything on your machine—no cloud, no third party—so your data stays with you.

## Features

- Convert multiple images into a single PDF
- Choose page size and orientation
- Select image fit (fit or stretch)
- Optional on-the-fly image compression

## Run Locally

**Prerequisites:**
- Node.js 18+ (LTS recommended)
- npm (bundled with Node.js)

### Quick start

```bash
# clone the repository
git clone https://github.com/<your-username>/image-to-pdf-converter.git
cd image-to-pdf-converter

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open the local URL printed by Vite (e.g., http://localhost:5173/) in your browser.

## Build

To create a production build:

```bash
npm run build
```

Then preview locally:

```bash
npm run preview
```

## Troubleshooting

- **Port in use:** Vite defaults to 5173. Either close the other process or run `npm run dev -- --port 5174`.
- **Node version errors:** Ensure Node.js is version 18 or newer (`node -v`).
- **Slow install or build:** Clear cache (`npm cache verify`) and reinstall `node_modules`.

## Roadmap / Upcoming features

- Desktop package/exe so anyone can run it without Node (Windows/macOS/Linux)
- Fully offline build you can open in a browser without sending any data to the cloud
- More PDF options (margins, DPI control, metadata, password protection)
- Drag-and-drop reordering and keyboard shortcuts
- Support for more image formats and batch operations

## License

This project is open source. See the repository license for details.
