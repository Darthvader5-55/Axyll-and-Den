# Axyll & Den — The Eternal Chapter

GitHub Pages-compatible interactive wedding announcement. No build step or server required.

## Publishing
1. Create a public GitHub repository.
2. Upload **all five files in this folder** to the repository root (`index.html`, `styles.css`, `script.js`, `marriage-memorandum.png`, `README.md`). No `assets` folder required.
3. In Settings → Pages, select Deploy from a branch → main → /(root), then Save.
4. Visit `https://USERNAME.github.io/REPO/` when deployment finishes.

## Interactions
5-second skippable/replayable intro, dual His & Hers themes, CSS 3D rings, letter-opening memorandum, story timeline, hidden love notes, scratch card, page-turning memory book, constellation, personalized greeting, bouquet, wish jar, local guest wishes, gift box, polaroids, swipe reveal, secret heart, cinematic ending, confetti and opt-in synthesized melody.

## Privacy and limits
Guest wishes are saved **only in each visitor's browser** using localStorage; they are not shared across devices. A public shared wall requires a backend/service. No real wedding date, venue or relationship facts have been invented. Memory-book artwork and polaroids are decorative placeholders, not personal photographs. Audio is synthesized by Web Audio API after user activation, not a licensed music file.

## Maintenance
All references to the memorandum use `marriage-memorandum.png` relative to `index.html`. Keep filenames identical (GitHub filenames are case-sensitive). The site is responsive and respects reduced-motion preferences for major motion effects.
