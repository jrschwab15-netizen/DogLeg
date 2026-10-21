const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={},c={main:{innerHTML:''},cloudUser:{id:'owner'},authScreen:'app',render(){},views:{Profile:()=>''},go(){},history:{pushState(){}},location:{pathname:'/admin/'},window:{addEventListener(){}},document:{hidden:false,addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}},clearTimeout,setTimeout,FormData:class{constructor(f){this.f=f}get(k){return this.f[k]}},esc:s=>String(s).replaceAll('<','&lt;').replaceAll('"','&quot;'),cloudInit:async()=>c.client};vm.createContext(c);vm.runInContext(fs.readFileSync('src/admin.js','utf8'),c);
const run=s=>vm.runInContext(s,c);
(async()=>{
 let resolve;c.client={rpc:()=>new Promise(r=>resolve=r)};const p=c.adminCheck();await new Promise(setImmediate);c.cloudUser={id:'other'};c.adminClear();resolve({data:{allowed:true,needs_pin:false}});await p;assert.equal(run('adminAccess'),null,'Late role responses cannot cross accounts');
 c.cloudUser={id:'owner'};c.adminClear();c.client={rpc:async()=>({data:{allowed:true,needs_pin:true}})};await c.adminCheck();assert(c.adminView().includes('Choose a 6–12 digit'));assert(c.adminView().includes('Confirm PIN'));
 let calls=0;c.client={rpc:async()=>{calls++;return{data:true}}};await c.adminSubmitPin({preventDefault(){},target:{pin:'123456',confirm:'654321'}},true);assert.equal(calls,0,'Mismatched PIN never sent');
 run("adminToken='token';adminData={statistics:{users:2,rounds:4},users:[{user_id:'owner',email:'owner@example.com',is_admin:true,rounds:1},{user_id:'other',email:'<img src=x>',is_admin:false,rounds:3}]}");const html=c.adminView();assert(!html.includes('<img src=x>'));assert(html.includes('Your administrator account'));assert(html.includes('Make administrator'));assert(!html.includes('Premium'));
 c.client={rpc:async(name,args)=>{assert.equal(name,'dogleg_admin_lock');assert.equal(args.unlock_token,'token');return{data:null}}};await c.adminLock();assert.equal(run('adminToken'),null);assert.equal(run('adminData'),null);
 const admin=fs.readFileSync('admin/index.html','utf8');assert(admin.includes('../assets/runtime/'));assert(!admin.includes('src="assets/runtime/'));
 console.log('Passed admin account-race isolation, PIN confirmation, escaped account list, lock/revocation call and hosted route asset paths.');
})().catch(e=>{console.error(e);process.exitCode=1});
