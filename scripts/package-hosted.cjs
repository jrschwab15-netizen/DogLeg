const fs=require('fs'),path=require('path'),crypto=require('crypto');
module.exports=function packageHosted(html){
 const root=path.resolve(__dirname,'..'),runtime=path.join(root,'assets/runtime');fs.mkdirSync(runtime,{recursive:true});
 const manifest={};
 const write=(kind,content,extension)=>{const hash=crypto.createHash('sha256').update(content).digest('hex').slice(0,12),name=`dogleg-${kind}.${hash}.${extension}`;fs.writeFileSync(path.join(runtime,name),content);manifest[kind]={file:'assets/runtime/'+name,bytes:Buffer.byteLength(content)};return manifest[kind].file};
 let hosted=html.replace(/<style>([\s\S]*?)<\/style>/,(_,css)=>`<link rel="stylesheet" href="${write('styles',css,'css')}">`);
 hosted=hosted.replace(/<script>([\s\S]*)<\/script>/,(_,js)=>`<script defer src="${write('app',js,'js')}"></script>`);
 hosted=hosted.replace('data:image/png;base64,'+fs.readFileSync(path.join(root,'assets/dogleg-sunset-d.png')).toString('base64'),'assets/dogleg-sunset-d.png');
 if(!manifest.app||!manifest.styles||Buffer.byteLength(hosted)>=1000000)throw Error('Hosted page must remain below the Messages 1 MB limit');
 for(const prefix of ['', 'dist/']){const base=path.join(root,prefix);fs.mkdirSync(base,{recursive:true});fs.writeFileSync(path.join(base,'index.html'),hosted);fs.writeFileSync(path.join(base,'standalone.html'),html)}
 fs.mkdirSync(path.join(root,'dist/assets'),{recursive:true});fs.cpSync(runtime,path.join(root,'dist/assets/runtime'),{recursive:true});fs.copyFileSync(path.join(root,'assets/dogleg-sunset-d.png'),path.join(root,'dist/assets/dogleg-sunset-d.png'));
 const admin=path.join(root,'admin');if(fs.existsSync(path.join(admin,'index.html'))){const adminHosted=hosted.replaceAll('href="assets/runtime/','href="../assets/runtime/').replaceAll('src="assets/runtime/','src="../assets/runtime/').replace('src="assets/dogleg-sunset-d.png"','src="../assets/dogleg-sunset-d.png"');fs.writeFileSync(path.join(admin,'index.html'),adminHosted);fs.mkdirSync(path.join(root,'dist/admin'),{recursive:true});fs.writeFileSync(path.join(root,'dist/admin/index.html'),adminHosted)}
 console.log(`Packaged ${Buffer.byteLength(hosted)}-byte hosted page; ${Buffer.byteLength(html)}-byte embedded standalone preserved`);
 return manifest;
};
