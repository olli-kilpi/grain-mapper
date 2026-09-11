# Grain Mapper

A small browser tool for visual-effects work: turn a grayscale map into a pixelated grain overlay and export a PNG.

Create a map from a cubic Bézier gradient, or upload your own. Then tweak grain size, threshold, jitter, and a locked random seed, and download a sharp (nearest-neighbor) PNG with optional white background.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default [http://127.0.0.1:3000](http://127.0.0.1:3000)).

## Build

```bash
npm run build
```

GitHub Pages is built from `main` with `VITE_BASE=/grain-mapper/`.
