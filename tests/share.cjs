const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8'),image=fs.readFileSync('assets/social/dogleg-share-v1.jpg'),demo=JSON.parse(fs.readFileSync('data/share-demo.json','utf8'));
assert.equal(image.readUInt16BE(0),0xffd8);let dimensions;
for(let i=2;i<image.length;){if(image[i]!==255){i++;continue}const marker=image[i+1];if([0xc0,0xc1,0xc2].includes(marker)){dimensions={height:image.readUInt16BE(i+5),width:image.readUInt16BE(i+7)};break}i+=2+image.readUInt16BE(i+2)}
assert.deepEqual(dimensions,{width:1200,height:630});assert(image.length<1000000);
const head=html.split('</head>')[0];assert(head.includes('property="og:image" content="https://doglegclub.com/og-image.jpg"'));assert(head.includes('property="og:image:width" content="1200"'));assert(head.includes('property="og:image:height" content="630"'));assert(head.includes('name="twitter:card" content="summary_large_image"'));assert(head.includes('property="og:image:alt"'));assert.deepEqual(fs.readFileSync('dist/assets/social/dogleg-share-v1.jpg'),image);
assert.equal(demo.scores.length,24);assert.equal(new Set(demo.courses.map(c=>c.country)).size,3);assert(fs.readFileSync('src/share-preview.html','utf8').includes('Illustrative demo data'));
console.log('Passed public static sharing metadata, exact 1200×630 JPEG dimensions, deploy-copy integrity and explicit fictional demo labeling.');

assert.deepEqual(fs.readFileSync('og-image.jpg'),image);assert.deepEqual(fs.readFileSync('dist/og-image.jpg'),image);assert(head.includes('property="og:url" content="https://doglegclub.com/"'));assert(head.includes('rel="canonical" href="https://doglegclub.com/"'));assert(!head.includes('/share/'));
