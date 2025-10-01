# Feedcruncher

A feed reader application with Tailwind CSS.

## Setup

This project uses Tailwind CSS with PostCSS to process the `@tailwind` directives in CSS files.

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

To build the CSS once:
```bash
npm run build:css
```

To watch for changes and rebuild automatically:
```bash
npm run watch:css
```

Or simply:
```bash
npm run dev
```

### Project Structure

- `src/styles/input.css` - Source CSS file with Tailwind directives
- `dist/styles/output.css` - Compiled CSS file (generated)
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `index.html` - Sample HTML file

### How it Works

The `@tailwind` directives in `src/styles/input.css` are processed by PostCSS with the Tailwind CSS plugin. This generates the final CSS file in `dist/styles/output.css` that can be used in your HTML files.

The PostCSS configuration (`postcss.config.js`) includes:
- `tailwindcss` - Processes Tailwind directives
- `autoprefixer` - Adds vendor prefixes for better browser compatibility