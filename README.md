# Cross-Frequency Performance Lab

An interactive, browser-based educational model for exploring latency and throughput in a cross-frequency statistical arbitrage processing pipeline.

## Live website

After publishing with GitHub Pages, the site will be available at:

`https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/`

Replace the placeholders with your GitHub username and repository name.

## Open locally

Download or clone this repository, then open `index.html` in a modern browser (Chrome, Edge, Firefox, or Safari). No build step or package installation is required.

## Project contents

- `index.html` — website structure and content
- `style.css` — visual styling and responsive layout
- `app.js` — interactive benchmark, traffic/queue, synchronization, rolling-statistics, and diagnostics models
- `docs/Research-Report.pdf` — accompanying research report
- `docs/Project-Presentation.pptx` — accompanying presentation

## Publish with GitHub Pages

1. Create a **public** repository on GitHub (for example, `cross-frequency-performance-lab`).
2. Upload the contents of this folder to the repository's **root** (so `index.html` is at the top level, not inside another folder).
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Wait for GitHub Pages to finish publishing. The website URL will appear in the Pages section.

## Important research note

This is a deterministic educational model, not a live exchange connection or a hardware benchmark. Its displayed values are illustrative model outputs, not measured production results. The accompanying report explicitly states that its 100 µs baseline and 60.2% reduction example are hypothetical. Replace these figures with repeatable measurements before describing them as empirical findings.

## External dependency

The page loads web fonts from Google Fonts. The site itself does not require a build tool or server-side runtime; if the font service is unavailable, browser fallback fonts are used.
