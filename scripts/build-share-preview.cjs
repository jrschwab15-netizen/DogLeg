const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p)),asset=p=>read(p).toString('base64');
const demo=JSON.parse(read('data/share-demo.json'));
if(!demo.scores.length||demo.scores.some(s=>!Number.isInteger(s)||s<18||s>360))throw Error('Invalid demo scores');
let html=read('src/share-preview.html').toString().replace('SHARE_FONT',asset('assets/source-sans-3-regular.ttf')).replace('SHARE_BOLD',asset('assets/source-sans-3-bold.ttf')).replace('SHARE_LOGO',asset('assets/dogleg-sunset-d.png')).replace('SHARE_SUNSET',asset('assets/course-sunset.jpeg')).replace('SHARE_DEMO_DATA',JSON.stringify(demo).replaceAll('<','\\u003c'));
fs.mkdirSync(path.join(root,'dist/social'),{recursive:true});fs.writeFileSync(path.join(root,'dist/social/preview.html'),html);
console.log('Built dist/social/preview.html — fictional data, no account connection');
