const http=require('http'),fs=require('fs'),path=require('path');const file=path.resolve(__dirname,'../dist/social/preview.html');
http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(file))}).listen(4182,'127.0.0.1',()=>console.log('Dogleg sharing preview: http://127.0.0.1:4182'));
