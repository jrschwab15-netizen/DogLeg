# Dogleg link preview

The public social image is `assets/social/dogleg-share-v1.jpg`: a 1200 × 630 JPEG screenshot of an intentionally composed demo journal. It features the approved Sunset D, original course photograph, real public course locations, a map, scoring summaries, recent rounds and a memory card. Map attribution stays visible.

Alex Morgan is fictional. This does not create a Supabase account, publish any real journal, or change local records. Every account statistic is illustrative; scoring average and best score are derived from `data/share-demo.json`. The preview is a marketing composition, rather than a screenshot of a particular live member's screen.

## Update the image

1. Edit `data/share-demo.json` for the name, scores, courses and recent rounds. Edit `src/share-preview.html` for the composition.
2. Run `node scripts/build-share-preview.cjs`, then `node scripts/serve-share-preview.cjs`. Open `http://127.0.0.1:4182`.
3. Set the browser viewport to exactly **1200 × 630**. Wait for fonts and all map tiles. Check that the full memory card, map attribution and footer fit, then capture a JPEG screenshot to a new `assets/social/dogleg-share-vN.jpg` file.
4. Update the image URL in the source metadata to the new versioned filename. Versioning avoids an older cached image being reused by clients. Run the app build, which copies social assets into `dist/assets/social` for static hosts.
5. Publish the static JPEG and the root HTML with its metadata, then confirm the image URL is accessible without signing in. Existing Messages previews may stay cached; new previews are controlled by the receiving app.

`og:*`, the canonical URL, description and Twitter large-image tags are present in the original HTML response. They are not inserted by JavaScript. This follows [Apple's rich-preview guidance](https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages). The shared link opens the ordinary Dogleg app; the demo composition is only its preview image. No iMessage messages were sent as a test.

## Verification

Browser-reviewed at 1200 × 630 with loaded map tiles and embedded fonts. Every element fits within the image; the saved JPEG is under 100 KB. Deployment checks should verify the public image is `image/jpeg`, has the declared dimensions, and the raw homepage response contains its exact absolute `og:image` URL. Actual iMessage rendering/cache behavior requires testing in Messages on an iPhone and is not claimed here.
