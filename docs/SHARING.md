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


## Messages resource-size correction

The first image deployment kept the 4.8 MB standalone HTML as the hosted homepage. Apple documents a 1 MB limit for the previewed main page, so the page could be rejected even though its metadata and JPEG were reachable. The hosted build now externalizes the exact compiled JavaScript and CSS into content-hashed assets and references the existing logo file. The release homepage is about 3 KB; its metadata is still present without JavaScript. A high-resolution approved logo is also supplied as the apple-touch-icon/favicon.

`standalone.html` keeps the complete embedded app. Demo fixture generators read that file. The build and tests enforce the hosted byte budget, bundle integrity and standalone preservation. Publish generated runtime assets alongside the homepage. Do not remove a previous runtime version while cached pages may still reference it. Already-generated Messages previews are client-controlled; actual rendering must still be checked on an iPhone.


## Dedicated Messages share page

Use `https://doglegclub.com/share/` for the public preview. It has its own matching canonical/og:url, a fresh image address, and the screenshot as a real visible HTML image. It requires no JavaScript, authentication or redirect to expose its metadata or photo. Open Dogleg enters the normal app. This isolates the preview from the homepage and its previous failed-preview identity; it is not proof of the remaining Messages failure cause. The user confirmed blue iMessage bubbles and that apple.com previews work in the same conversation. Native Messages still needs user verification.
