const http=require('http'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),port=Number(process.argv[2]||4173);
http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname,fixture=pathname.match(/^\/__qa\/(friends|friends-empty)$/);let file,type='text/html; charset=utf-8';
 if(fixture)file=path.join(root,'dist/ui-fixtures',fixture[1]+'.html');
 else if(['/', '/index.html'].includes(pathname))file=path.join(root,'index.html');
 else if(pathname==='/standalone.html')file=path.join(root,'standalone.html');
 else if(['/admin','/admin/'].includes(pathname))file=path.join(root,'admin/index.html');
 else if(/^\/assets\/runtime\/[a-z0-9.-]+\.(js|css)$/.test(pathname)){file=path.join(root,pathname.slice(1));type=pathname.endsWith('.js')?'application/javascript; charset=utf-8':'text/css; charset=utf-8'}
 else if(/^\/assets\/social\/[a-z0-9.-]+\.jpg$/.test(pathname)){file=path.join(root,pathname.slice(1));type='image/jpeg'}
 else if(pathname==='/assets/dogleg-sunset-d.png'){file=path.join(root,pathname.slice(1));type='image/png'}
 if(!file||!fs.existsSync(file)){res.writeHead(404);return res.end('Not found')}
 res.setHeader('Content-Type',type);res.end(fs.readFileSync(file));
}).listen(port,'127.0.0.1',()=>console.log(`Dogleg: http://127.0.0.1:${port}`));
