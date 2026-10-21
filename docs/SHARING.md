# Dogleg link preview

Share the normal site URL: **https://doglegclub.com/**. No separate landing page or query parameter is required.

The main `index.html` contains static Open Graph and Twitter metadata. Its canonical URL and `og:url` both point to the normal homepage. The preview image is committed at the repository root as **og-image.jpg**, publicly available at **https://doglegclub.com/og-image.jpg**. The separate `/share/` page has been removed at the user's request.

The image is a 1200 × 630 JPEG of a fictional demo journal: course map, scoring statistics, recent rounds and a memory photo. It uses the approved logo and original course photograph; no real member account or journal is published.

## Update the screenshot

1. Edit `data/share-demo.json` and, if needed, `src/share-preview.html`.
2. Run `node scripts/build-share-preview.cjs`, then `node scripts/serve-share-preview.cjs`.
3. Capture the fully loaded page at exactly 1200 × 630 to `assets/social/dogleg-share-v1.jpg`.
4. Run the normal build. It copies that screenshot to `og-image.jpg` and `dist/og-image.jpg`.
5. Publish the generated root HTML, root image and required runtime assets to GitHub Pages. An image-only cache version can be added to the metadata's image URL after future image changes; the shared website URL stays the normal homepage.

The hosted HTML remains small (about 3 KB), with exact compiled JavaScript and CSS loaded from `assets/runtime/`. `standalone.html` retains the fully embedded application. This addresses [Apple's documented 1 MB main-page guideline](https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages).

## Verification limits

Tests check static metadata, the normal homepage identity, the JPEG dimensions, root/dist image parity, the hosted size budget and standalone preservation. The user reported blue iMessage messages showing a plain Dogleg URL while apple.com previews work. HTTP availability and third-party Open Graph validation do not establish that Messages renders a preview on that device. Do not label native Messages rendering verified without the user's confirmation.
