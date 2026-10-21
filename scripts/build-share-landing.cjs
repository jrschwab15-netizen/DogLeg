const fs=require('fs'),path=require('path');
module.exports=function buildShareLanding(){const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'src/share-landing.html'),'utf8'),image=fs.readFileSync(path.join(root,'assets/social/dogleg-share-v1.jpg'));
 if(Buffer.byteLength(html)>20000)throw Error('Keep the public sharing page small');
 for(const p of ['share','dist/share']){const dir=path.join(root,p);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);fs.writeFileSync(path.join(dir,'preview-v2.jpg'),image)}
 console.log('Built public share page and fresh preview image URL');
};
if(require.main===module)module.exports();
