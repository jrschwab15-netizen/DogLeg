const fs=require('fs'),vm=require('vm'),assert=require('assert');
const journal=()=>({profile:{name:'Test golfer',home:'Course',goal:20},rounds:[],notes:[],friends:[],challenges:[],shared:[],invites:[],draft:null});
const storage=new Map(),calls=[];
let reply={data:{revision:2},error:null},deferred;
const c={console,KEY:'guest',state:journal(),validBackup:d=>!!d&&['rounds','notes','friends','challenges','shared','invites'].every(k=>Array.isArray(d[k])),localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},document:{querySelector:()=>null},window:{scrollTo(){}},setTimeout:()=>0,clearTimeout(){},toast(){},render(){},esc:s=>s,initial:journal};
vm.createContext(c);vm.runInContext('//'+fs.readFileSync('src/features.js','utf8').split('// Private Supabase journals.')[1],c);
const run=s=>vm.runInContext(s,c);
const client={from:()=>{const q={insert:r=>{calls.push(['insert',r]);return q},update:r=>{calls.push(['update',r]);return q},eq:(...args)=>{calls.push(['eq',...args]);return q},select:()=>q,maybeSingle:()=>deferred||Promise.resolve(reply)};return q}};
c.testClient=client;
run("cloudClient=testClient;cloudUser={id:'alice',email:'alice@example.test'};cloudReady=true;cloudRevision=1;cloudDirty=true;");
(async()=>{
 await c.cloudSave();
 assert.equal(run('cloudRevision'),2);assert.equal(run('cloudDirty'),false);
 assert(calls.some(x=>x[0]==='eq'&&x[1]==='revision'&&x[2]===1));
 assert(calls.some(x=>x[0]==='eq'&&x[1]==='user_id'&&x[2]==='alice'));
 assert(storage.has('guest:account:alice'));assert(!storage.has('guest'));
 run("cloudDirty=true");reply={data:null,error:null};await c.cloudSave();
 assert.equal(run('cloudReady'),false);assert.equal(run('cloudDirty'),true);assert(run('cloudStatus').includes('newer changes'));
 run("cloudReady=true");reply={data:null,error:{message:'Offline'}};await c.cloudSave();
 assert.equal(run('cloudDirty'),true);assert.equal(run('cloudRevision'),2);
 const current=journal(),incoming=journal();current.rounds=[{id:'same',score:80}];incoming.rounds=[{id:'same',score:99},{id:'new',score:90}];
 const merged=c.cloudMerge(current,incoming);assert.equal(merged.rounds.length,2);assert.equal(merged.rounds[0].score,80);assert.equal(current.rounds.length,1);
 // A save completing after logout must not modify the next account.
 let release;deferred=new Promise(resolve=>release=resolve);const pending=c.cloudSave();run("cloudEpoch++;cloudUser={id:'bob'};cloudRevision=0;cloudDirty=false");release({data:{revision:3},error:null});await pending;
 assert.equal(run('cloudRevision'),0);assert.equal(run('cloudDirty'),false);assert(!storage.has('guest:account:bob'));
 assert(!c.cloudValid({...journal(),profile:{name:'x',home:'y',goal:0}}));
 // A new page restores the account journal immediately, before a network request.
 storage.set('dogleg-auth-v1',JSON.stringify({user:{id:'alice',email:'alice@example.test'},access_token:'test-only',refresh_token:'test-only'}));
 const restored=journal();restored.profile.name='Returning golfer';
 storage.set('guest:account:alice',JSON.stringify({data:restored,revision:4,dirty:true}));
 let authOptions;
 c.window.supabase={createClient:(url,key,options)=>{authOptions=options.auth;return {auth:{onAuthStateChange(){},signOut:async()=>{storage.delete('dogleg-auth-v1');return {error:null}}}}}};
 run("cloudClient=null;cloudLoading=null;cloudUser=null;cloudBusy=false;authScreen='loading'");
 await c.cloudBoot();
 assert.equal(c.state.profile.name,'Returning golfer');assert.equal(run('authScreen'),'app');assert.equal(run('cloudDirty'),true);
 assert.equal(authOptions.persistSession,true);assert.equal(authOptions.autoRefreshToken,true);assert.equal(authOptions.storage,c.localStorage);assert.equal(authOptions.storageKey,'dogleg-auth-v1');
 await c.acceptAuthSession({user:{id:'alice',email:'alice@example.test'}},'TOKEN_REFRESHED');
 assert.equal(c.state.profile.name,'Returning golfer');assert.equal(run('cloudRevision'),4);
 await c.cloudSignOut();assert.equal(run('authScreen'),'signin');assert.equal(run('cloudUser'),null);assert(storage.has('guest:account:alice'));
 // Offline startup still restores the cached account journal.
 storage.set('dogleg-auth-v1',JSON.stringify({user:{id:'alice',email:'alice@example.test'}}));
 c.window.supabase={createClient:()=>{throw Error('Offline')}};
 run("cloudClient=null;cloudLoading=null;cloudUser=null;authScreen='loading'");
 await c.cloudBoot();assert.equal(run('authScreen'),'app');assert.equal(c.state.profile.name,'Returning golfer');assert.equal(run('cloudReady'),false);
 assert(c.authView);run("authMode='signup';authScreen='signin'");assert(c.authView().includes('Confirm password'));assert(c.authView().includes('autocomplete="new-password"'));
 run("authMode='signin'");assert(c.authView().includes('autocomplete="current-password"'));
 // Signup validates password confirmation, then accepts an immediate Supabase session.
 let fields={name:'New golfer',email:'new@example.invalid',password:'test-password',confirm:'different'};
 c.FormData=class{get(name){return fields[name]}};
 const form={querySelectorAll:()=>[],reset(){}};
 run("authMode='signup';authWorking=false");
 await c.submitAccount({preventDefault(){},target:form});
 assert(run('authNotice').includes('don’t match'));assert.equal(run('authWorking'),false);
 fields.confirm=fields.password;c.go=()=>{};
 const newUser={id:'new-account',email:fields.email,user_metadata:{display_name:fields.name}};
 c.testClient.auth={signUp:async()=>({data:{user:newUser,session:{user:newUser}},error:null})};
 deferred=null;reply={data:null,error:null};
 run("cloudClient=testClient;cloudLoading=null;cloudUser=null;cloudDirty=false;cloudBusy=false;authMode='signup'");
 await c.submitAccount({preventDefault(){},target:form});
 assert.equal(run('authScreen'),'app');assert.equal(c.state.profile.name,'New golfer');assert.equal(run('authWorking'),false);
 assert(!storage.get('guest:account:new-account').includes('test-password'));
 console.log('Passed cloud revision conflicts, ownership filters, account cache isolation, offline preservation, safe import, and logout race checks.');
})().catch(e=>{console.error(e);process.exitCode=1});

