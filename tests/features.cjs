const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();const element=()=>({textContent:'',value:'',hidden:false,disabled:false,className:'',setAttribute(){},append(){},addEventListener(){}});
const context={console,document:{createElement:element,head:element(),body:element(),querySelector:s=>{if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll:()=>[]},window:{},modal:element(),openModal(){},navigator:{},URL,URLSearchParams,AbortSignal,Math,Date,Map,Set,Number,Promise,setTimeout,clearTimeout,toast(){},roundForm(){},noteForm(){},esc:s=>String(s).replaceAll('<','&lt;')};
vm.createContext(context);vm.runInContext(fs.readFileSync('src/features.js','utf8'),context);
assert.equal(vm.runInContext("parseScorecard('Total score: 84').total",context),84);
assert.equal(vm.runInContext("parseScorecard('PAR 4 4 3 5 4 4 3 5 4').scores",context),null);
assert.equal(vm.runInContext("parseScorecard('Scores: 4 4 3 5 4 4 3 5 4').scores.length",context),9);
assert.equal(vm.runInContext("parseScorecard('Scores: 4 4 0 5 4 4 3 5 4').scores",context),null);
assert.equal(vm.runInContext("parseScorecard('Total score 999').total",context),null);
assert(vm.runInContext("clubQuery('St. Andrews')",context).includes('St\\\\. Andrews'));
assert(vm.runInContext("clubQuery('',{lat:40.12,lon:-73.22})",context).includes('(around:30000,40.12,-73.22)'));
assert(vm.runInContext("distance({lat:40,lon:-73},{lat:40,lon:-73})",context)===0);
context.nearbyClubs();assert(elements.get('#club-status').textContent.includes('unavailable'));
context.navigator.geolocation={getCurrentPosition:(success,error)=>error({code:1})};context.nearbyClubs();assert(elements.get('#club-status').textContent.includes('declined'));
context.pickScorecard({type:'application/pdf',size:500});assert(elements.get('#scan-status').textContent.includes('PNG'));
context.pickScorecard({type:'image/png',size:16000000});assert(elements.get('#scan-status').textContent.includes('15 MB'));
const html=fs.readFileSync('index.html','utf8');new vm.Script(html.match(/<script>([\s\S]*)<\/script>/)[1]);
context.savedRounds=[
 {id:'a',course:'Meadow Links',tees:'White',notes:'Windy finish',date:'2026-09-01',holes:18,score:90},
 {id:'b',course:'Oak and Pine',tees:'Blue',notes:'Morning nine',date:'2025-08-01',holes:9,score:43},
 {id:'c',course:'Meadow Links',tees:'Blue',notes:'Best finish',date:'2026-10-01',holes:18,score:84}
];
assert.equal(vm.runInContext("selectRounds(savedRounds,{query:'BLUE',year:'all',holes:'all',sort:'newest'}).length",context),2);
assert.equal(vm.runInContext("selectRounds(savedRounds,{query:'finish',year:'2026',holes:'18',sort:'score'})[0].id",context),'c');
assert.equal(vm.runInContext("selectRounds(savedRounds,{query:'',year:'all',holes:'9',sort:'oldest'})[0].id",context),'b');
assert.equal(vm.runInContext("selectRounds(savedRounds,{query:'missing',year:'all',holes:'all',sort:'newest'}).length",context),0);
assert.equal(context.savedRounds[0].id,'a');
const season=vm.runInContext("seasonSummary(savedRounds,3,'2026')",context);
assert.equal(season.played,2);assert.equal(season.courses,1);assert.equal(season.best,84);assert.equal(season.holes,36);
context.season=season;assert.equal(vm.runInContext("earnedMilestones(season).filter(m=>m.earned).map(m=>m.id).join(',')",context),'first,ninety');
context.mixedRounds=[{...context.savedRounds[0],sample:true,score:60},{...context.savedRounds[2],score:90}];
assert.equal(vm.runInContext("seasonSummary(mixedRounds,20,'2026').best",context),90);
assert.equal(vm.runInContext("seasonSummary(mixedRounds,20,'2026').played",context),1);
context.nineRounds=[{...context.savedRounds[1],date:'2026-10-01'}];
assert.equal(vm.runInContext("seasonSummary(nineRounds,20,'2026').best",context),null);
assert.equal(vm.runInContext("earnedMilestones(seasonSummary(nineRounds,20,'2026')).find(m=>m.id==='ninety').earned",context),false);
assert.equal(vm.runInContext("newMilestones(seasonSummary([],20,'2026'),seasonSummary(nineRounds,20,'2026')).map(m=>m.id).join(',')",context),'first');
context.previewRounds=context.savedRounds.map(r=>({...r,sample:true}));
assert.equal(vm.runInContext("newMilestones(seasonSummary([],20,'2026'),seasonSummary(previewRounds,20,'2026')).length",context),0);
assert.equal(vm.runInContext("newMilestones(seasonSummary(previewRounds,20,'2026'),seasonSummary(nineRounds,20,'2026')).map(m=>m.id).join(',')",context),'first');
context.icons={Home:'',Rounds:'',Passport:'',Friends:'',Profile:''};context.tab='Friends';context.icon=()=>'<svg></svg>';
const nav=context.navigationItems();assert(nav.includes('desktop-friends'));assert(nav.includes('contains-friends'));assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
console.log('Passed feature syntax, scorecard parsing, query escaping, nearby radius, distance, location unavailable/denied, and upload validation checks.');

context.lookupRecords=[{course:'Pine Valley',date:'2026-01-01',tees:'White',holes:18,rating:71,slope:120},{course:'Pine Valley',date:'2026-10-01',tees:'Blue',holes:18,rating:73,slope:130},{course:'Pine Demo',date:'2026-10-02',sample:true}];
const matches=vm.runInContext("savedCourseMatches(lookupRecords,'pine')",context);assert.equal(matches.length,1);assert.equal(matches[0].tees,'Blue');assert.equal(matches[0].slope,130);assert.equal(vm.runInContext("savedCourseMatches(lookupRecords,'missing').length",context),0);
assert(html.includes('oninput="queueRoundCourses(this.value)"'));

context.state={rounds:context.lookupRecords};context.drawHoles=()=>{};const fields=Object.fromEntries(['course','holes','tees','rating','slope','score','notes'].map(k=>[k,{value:k==='holes'?'18':k==='score'?'84':'keep'}]));const originalQuery=context.document.querySelector;context.document.querySelector=s=>s==='#round-form'?{querySelector:s=>fields[s.match(/name=([^\]]+)/)[1]]}:originalQuery(s);
context.fillRoundCourse({name:'Pine Valley',holes:'18'});assert.equal(fields.tees.value,'Blue');assert.equal(fields.rating.value,73);assert.equal(fields.score.value,'84');assert.equal(fields.notes.value,'keep');
context.fillRoundCourse({name:'New Course',holes:'18'});assert.equal(fields.rating.value,'');assert.equal(fields.slope.value,'');assert.equal(fields.score.value,'84');
