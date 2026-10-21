const fs=require('fs'),vm=require('vm'),assert=require('assert');
const template=fs.readFileSync('src/template.html','utf8');
const fields={course:'No published card course',date:'2026-10-21',holes:'18',tees:'',score:'89',rating:'',slope:'',putts:'',notes:''};
const form={},c={console,Number,Math,JSON,FormData:class{get(k){return fields[k]}},document:{querySelector:s=>s==='#round-form'?form:null,querySelectorAll:()=>Array.from({length:18},()=>({value:''}))},roundCourseLocation:null,roundLocationName:'',roundPhotoDraft:[],roundPhotoBusy:false,crypto:{randomUUID:()=> 'qa-minimal-round'},modal:{close(){}},render(){},toast(){},validRoundPhotos:()=>true,validRoundExtras:()=>true,validCourseCard:()=>false,state:{rounds:[],notes:[],friends:[],challenges:[],shared:[],invites:[]},persist(){c.saved=JSON.parse(JSON.stringify(c.state));return true},ordered(){return c.state.rounds}};
vm.createContext(c);
for(const name of ['readRound','saveRound','validBackup','differential','estimate']){
 const line=template.split('\n').find(l=>l.startsWith('function '+name+'(')||l.startsWith('async function '+name+'('));assert(line,'Missing '+name);vm.runInContext(line,c);
}
(async()=>{
 await c.saveRound({preventDefault(){}},'');
 assert(c.saved,'Course/date/score must save without waiting for a provider');
 assert.equal(c.saved.rounds.length,1);assert.equal(c.saved.rounds[0].score,89);
 assert.equal(c.saved.rounds[0].rating,null);assert.equal(c.saved.rounds[0].slope,null);assert.equal(c.saved.rounds[0].tees,'');
 assert(c.validBackup(c.saved),'Minimal rounds must remain valid in backups and cloud validation');
 assert.equal(c.differential(c.saved.rounds[0]),null);assert.equal(c.estimate(c.saved.rounds),null);
 const rated={...c.saved.rounds[0],rating:72,slope:113,score:90};assert.equal(c.differential(rated),18);
 const mixed=[rated,rated,rated,...Array.from({length:25},()=>c.saved.rounds[0])];assert.equal(c.estimate(mixed),18);
 c.saved.rounds[0].rating=0;assert(!c.validBackup(c.saved),'Missing ratings must not be fabricated as zero');
 fields.rating='71.2';fields.slope='128';fields.tees='White';const detailed=c.readRound();assert.equal(detailed.rating,71.2);assert.equal(detailed.slope,128);
 const line=template.split('\n').find(l=>l.startsWith('function roundForm('));
 const required=[...line.matchAll(/<input([^>]*\brequired\b[^>]*)>/g)].map(m=>m[1].match(/name="([^"]+)"/)?.[1]);assert.deepEqual(required,['course','date','score']);
 fields.scoreNotKept='on';fields.score='';await c.saveRound({preventDefault(){}},'');
 const unscored=c.saved.rounds[0];assert.equal(unscored.score,null);assert.equal(unscored.scoreNotKept,true);assert(c.validBackup(c.saved));assert.equal(c.differential({...unscored,rating:72,slope:113}),null);assert.equal(c.estimate([rated,rated,rated,unscored]),18);
 delete fields.scoreNotKept;const count=c.state.rounds.length;await c.saveRound({preventDefault(){}},'');assert.equal(c.state.rounds.length,count,'Blank score still requires explicit override');
 const calendar={Date,today:()=> '2026-10-21'};vm.createContext(calendar);vm.runInContext(fs.readFileSync('src/features.js','utf8').split('let roundDateView=null;')[1],calendar);
 assert(calendar.roundDateParts('2024-02-29'));assert.equal(calendar.roundDateParts('2026-02-29'),null);assert.equal(calendar.roundDateIso(2026,12,1),'2027-01-01');
 const markup=calendar.roundCalendarMarkup('2026-10-21',2024,1);assert.equal((markup.match(/data-round-date=/g)||[]).length,29);assert.equal((markup.match(/tabindex="0"/g)||[]).length,1);
 console.log('Passed minimal round save, null metadata, backup validity, known-tee preservation and handicap exclusion.');
})().catch(e=>{console.error(e);process.exitCode=1});
