const fs=require('fs'),assert=require('assert'),vm=require('vm');
const hosted=fs.readFileSync('index.html','utf8'),standalone=fs.readFileSync('standalone.html','utf8');
assert(Buffer.byteLength(hosted)<1000000,'Messages requires a main page under 1 MB');assert(Buffer.byteLength(hosted)<20000,'Keep the HTML small enough for reliable unfurling');
assert(hosted.includes('property="og:image"'));assert(hosted.includes('rel="apple-touch-icon"'));assert(!hosted.includes('data:image/'));assert(!hosted.includes('data:font/'));
const app=hosted.match(/<script defer src="([^"]+)"/)[1],styles=hosted.match(/rel="stylesheet" href="([^"]+)"/)[1];
new vm.Script(fs.readFileSync(app,'utf8'));assert(standalone.includes('data:image/jpeg;base64,'));assert(standalone.includes('data:font/ttf;base64,'));
assert.equal(fs.readFileSync(app,'utf8'),standalone.match(/<script>([\s\S]*)<\/script>/)[1]);assert.equal(fs.readFileSync(styles,'utf8'),standalone.match(/<style>([\s\S]*?)<\/style>/)[1]);
for(const file of ['index.html','standalone.html',app,styles,'assets/dogleg-sunset-d.png'])assert.deepEqual(fs.readFileSync('dist/'+file),fs.readFileSync(file));
console.log(`Passed ${Buffer.byteLength(hosted)}-byte hosted HTML budget, static preview/icon tags, asset integrity, JavaScript syntax and fully embedded standalone preservation.`);
