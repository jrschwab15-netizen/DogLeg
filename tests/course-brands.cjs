const fs=require('fs'),vm=require('vm'),assert=require('assert');
const brands=JSON.parse(fs.readFileSync('assets/course-logos/manifest.json','utf8'));
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('src/course-brands.js','utf8').replace('COURSE_BRANDS_DATA',JSON.stringify(brands)),c);
const pa=c.courseBrand({name:'Oakmont Country Club',location:{lat:40.526,lon:-79.826}}),ca=c.courseBrand({name:'Oakmont Country Club',location:{lat:34.19,lon:-118.23}});
assert.equal(pa.file,'oakmont.svg');assert.equal(ca.file,'oakmont-glendale.png');assert.equal(c.courseBrand('Oakmont Country Club'),undefined);
assert.equal(c.courseBrand({courseId:'4eb9126d-4857-4f25-87b8-47f8e15a2eac',name:'Oakmont Country Club'}).file,'oakmont-glendale.png');
assert.equal(c.courseBrand({name:'TPC Sawgrass Dye’s Valley Course',location:{lat:30.20,lon:-81.39}}).file,'tpc-sawgrass.png');
assert.equal(c.courseBrand('PINEHURST No 2').file,'pinehurst.svg');assert.equal(c.courseBrand({name:'Torrey Pines South Course',location:{lat:32.90,lon:-117.25}}).file,'torrey-pines.png');
assert.equal(c.courseBrand({name:'Torrey Pines South Course',location:{lat:1,lon:1}}),undefined);assert.equal(c.courseBrand('Unverified Golf Club'),undefined);
assert.equal(c.courseLogoId({course:'Manual course',id:'40977ee8-33ee-4195-b6a2-99a4ca83c2bc'}),null);assert.equal(c.courseLogoId({name:'Directory course',id:'40977ee8-33ee-4195-b6a2-99a4ca83c2bc'}),'40977ee8-33ee-4195-b6a2-99a4ca83c2bc');
for(const b of brands){assert(b.source.startsWith('https://'));assert(b.asset.startsWith('https://'));const data=fs.readFileSync('assets/course-logos/'+b.file);if(b.file.endsWith('.svg')){const svg=data.toString();assert(svg.includes('<svg'));assert(!/<script\b|<foreignObject\b|\son\w+=|(?:href|xlink:href)\s*=\s*["']https?:/i.test(svg),b.file+' must be self contained artwork')}else assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a',b.file+' must be a real PNG')}
console.log('Passed official artwork integrity, source receipts, punctuation matching, course IDs, geographic mismatch and distinct Oakmont clubs.');
