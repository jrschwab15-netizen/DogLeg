const fs=require('fs'),vm=require('vm'),assert=require('assert');
const element=()=>({textContent:'',append(){},setAttribute(){}});
const c={console,modal:{addEventListener(){}},document:{createElement:element,head:element(),querySelector:()=>null},window:{},URL,URLSearchParams,AbortSignal,setTimeout,clearTimeout};
vm.createContext(c);vm.runInContext(fs.readFileSync('src/course-schema.js','utf8').replaceAll('export function ','function '),c);vm.runInContext(fs.readFileSync('src/features.js','utf8')+'\n'+fs.readFileSync('src/round-social.js','utf8'),c);
assert(c.validRoundPhotos(undefined));assert(c.validRoundPhotos([]));
assert(c.validRoundPhotos(['data:image/jpeg;base64,/9j/']));
assert(!c.validRoundPhotos(['https://example.com/photo.jpg']));
assert(!c.validRoundPhotos(['data:image/svg+xml;base64,PHN2Zz4=']));
assert(!c.validRoundPhotos(Array(4).fill('data:image/jpeg;base64,/9j/')));
assert(!c.validRoundPhotos(['data:image/jpeg;base64,'+'a'.repeat(90000)]));
const round={id:'round',course:'Course',date:'2026-10-20',holes:18,score:84,tees:'Blue',notes:'Great day',rating:72,slope:113,putts:30,photos:['data:image/jpeg;base64,/9j/']};
c.state={rounds:[round]};c.go=()=>{};c.viewKnownCourse(0);assert.equal(vm.runInContext('trackingFilters.query',c),'Course');const payload=c.roundPostPayload(round,'Golfer');assert.equal(payload.course,'Course');assert.equal(payload.photos.length,1);assert(!('rating' in payload));assert(!('putts' in payload));
// V7 backups without photos remain valid, while unsafe/oversized photo fields do not.
vm.runInContext(fs.readFileSync('src/template.html','utf8').split('\n').find(l=>l.startsWith('function validBackup(')),c);
const journal={rounds:[{...round,scores:[],putts:null}],notes:[],friends:[],challenges:[],shared:[],invites:[]};
assert(c.validBackup(journal));delete journal.rounds[0].photos;assert(c.validBackup(journal));journal.rounds[0].photos=['javascript:alert(1)'];assert(!c.validBackup(journal));
// A completed feed request must never populate another signed-in user's feed.
let release;const pending=new Promise(r=>release=r);c.testClient={from:()=>({select(){return this},order(){return this},limit(){return pending},then(resolve,reject){return pending.then(resolve,reject)}})};
vm.runInContext("cloudUser={id:'alice'};cloudClient=testClient;socialOwner='alice';",c);
(async()=>{const loading=c.loadSocial();await Promise.resolve();vm.runInContext("cloudUser={id:'bob'};socialReset();",c);release({data:[{user_id:'alice',payload}],error:null});await loading;assert.equal(vm.runInContext('socialPosts.length',c),0);assert.equal(vm.runInContext('socialConnections.length',c),0);let releaseDelete;const deleteWait=new Promise(r=>releaseDelete=r);c.cloudInit=()=>deleteWait;c.state={rounds:[{id:'same-round'}]};vm.runInContext("cloudUser={id:'alice'};",c);const deleting=c.deleteSavedRound('same-round');vm.runInContext("cloudUser={id:'bob'};",c);let touched=false;releaseDelete({from(){touched=true;throw Error('Unexpected cross-account mutation')}});await deleting;assert.equal(touched,false);assert.equal(c.state.rounds.length,1);console.log('Passed photo limits, unsafe URI rejection, V7 photo compatibility, post payload and feed account-race checks.');})().catch(e=>{console.error(e);process.exitCode=1});
