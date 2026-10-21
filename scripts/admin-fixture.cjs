// Local-only admin preview; all account operations are mocked, never sent to Supabase.
const fs=require('fs'),http=require('http');let html=fs.readFileSync('standalone.html','utf8').replace("const KEY='dogleg.v7'","const KEY='dogleg.qa.admin'").replace('setTimeout(cloudBoot,0);','');
const setup=`
cloudUser={id:'00000000-0000-4000-8000-000000000001',email:'owner@example.test'};authScreen='app';cloudReady=false;
const qaAdminUsers=[{user_id:cloudUser.id,email:'owner@example.test',is_admin:true,rounds:3},{user_id:'00000000-0000-4000-8000-000000000002',email:'golfer@example.test',is_admin:false,rounds:2}];
cloudInit=async()=>({rpc:async(name,args)=>{if(name==='dogleg_admin_status')return{data:{allowed:true,needs_pin:location.search.includes('enroll')}};if(name==='dogleg_admin_unlock')return{data:'synthetic-token'};if(name==='dogleg_admin_overview')return{data:{statistics:{users:2,rounds:5},users:qaAdminUsers}};if(name==='dogleg_admin_role'){qaAdminUsers.find(u=>u.user_id===args.target_user).is_admin=args.enabled;return{data:null}};return{data:null}}});
`;
const end=html.lastIndexOf('\nrender();');html=html.slice(0,end)+'\n'+setup+html.slice(end);http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(html)}).listen(Number(process.argv[2]||4197),'127.0.0.1',()=>console.log('Synthetic admin preview ready'));
