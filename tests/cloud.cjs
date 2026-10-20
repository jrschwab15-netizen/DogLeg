const fs=require('fs'),vm=require('vm'),assert=require('assert');
const journal=()=>({profile:{name:'Test golfer',home:'Course',goal:20},rounds:[],notes:[],friends:[],challenges:[],shared:[],invites:[],draft:null});
const storage=new Map(),calls=[];
let reply={data:{revision:2},error:null},deferred;
const c={console,KEY:'guest',state:journal(),validBackup:d=>!!d&&['rounds','notes','friends','challenges','shared','invites'].every(k=>Array.isArray(d[k])),localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{querySelector:()=>null},window:{},setTimeout:()=>0,clearTimeout(){},toast(){},render(){},esc:s=>s,initial:journal};
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
 console.log('Passed cloud revision conflicts, ownership filters, account cache isolation, offline preservation, safe import, and logout race checks.');
})().catch(e=>{console.error(e);process.exitCode=1});

