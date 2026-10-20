const fs=require('fs'),vm=require('vm'),assert=require('assert');
const schema=fs.readFileSync('src/course-schema.js','utf8').replaceAll('export function ','function '),c={console,Map,Set,Date,Number,Math,URLSearchParams,AbortSignal,localStorage:{getItem(){return null},setItem(){}},document:{querySelector(){return null},querySelectorAll(){return []}},modal:{addEventListener(){}},findRoundCourses(){},fillRoundCourse(){},searchClubs(){},roundForm(){},readRound(){return {}},drawHoles(){},queueRoundCourses(){}};
vm.createContext(c);vm.runInContext(schema+'\n'+fs.readFileSync('src/course-data.js','utf8'),c);
const raw={id:'40977ee8-33ee-4195-b6a2-99a4ca83c2bc',course_name:'Links',holes:18,lat:36, lng:-121,tees:[{tee_key:'white-male',tee_name:'White',tee_color:'white',gender:'Male',course_rating:72,slope:130,yardage:6200,par:72},{tee_key:'white-female',tee_name:'White',tee_color:'white',gender:'Female',course_rating:77,slope:139,yardage:6200,par:72}],holes_data:[{number:1,par:4,handicap_index:7,yardages:{white:337,blue:378}},{number:2,par:5,handicap_index:3,yardages:{blue:510}}]};
c.course=c.normalizeCourse(raw);assert.equal(c.course.tees[0].holes[0].yards,337);assert.equal(c.course.tees[0].holes[1].yards,null);assert.equal(c.course.tees[1].rating,77);assert(c.validImportedCourse(c.course));assert(!c.validCourseCard({source:'OpenGolfAPI',courseId:'bad',tee:c.course.tees[0]}));
const fields={holes:{value:'18'},tees:{value:''},rating:{value:''},slope:{value:''}};const controls={innerHTML:''};c.document.querySelector=s=>s==='#round-form'?{querySelector:s=>fields[s.match(/name=(\w+)/)?.[1]]}:s==='#round-form [name=holes]'?fields.holes:s==='#course-card-controls'?controls:null;
vm.runInContext('importedCourse=course;renderCourseControls=()=>{};drawHoles=()=>{}',c);c.selectCourseTee('1');assert.equal(fields.rating.value,77);assert.equal(fields.tees.value,'White');fields.holes.value='9';c.courseRoundLength(9);assert.equal(fields.rating.value,''); // An incomplete 18-hole card still cannot supply a nine-hole rating.
c.course.tees[1].holes=Array.from({length:18},(_,i)=>({number:i+1,par:4,handicap:i+1,yards:300+i}));vm.runInContext('selectedCourseCard.tee.holes=course.tees[1].holes',c);c.courseRoundLength(9);assert.equal(fields.rating.value,'');assert.equal(fields.slope.value,'');assert.equal(vm.runInContext('courseCardHoles().length',c),9);vm.runInContext("courseNine='back'",c);assert.equal(vm.runInContext('courseCardHoles()[0].number',c),10);
vm.runInContext(fs.readFileSync('src/template.html','utf8').split('\n').find(l=>l.startsWith('function validBackup(')),c);c.validRoundPhotos=()=>true;const round={id:'r',course:'Links',date:'2026-10-20',holes:18,score:84,rating:72,slope:130,tees:'White',putts:null,notes:'',scores:[],courseCard:{source:'OpenGolfAPI',courseId:raw.id,tee:c.course.tees[0]}};const journal={rounds:[round],notes:[],friends:[],challenges:[],shared:[],invites:[]};assert(c.validBackup(journal));round.courseCard.tee.holes[0].yards=Infinity;assert(!c.validBackup(journal));delete round.courseCard;assert(c.validBackup(journal));
console.log('Passed exact tee yardages, separate rating sets, missing-data handling, nine-hole rating safety and V7 course-card validation.');

assert.equal(c.preferredCourseTee(c.course,{courseCard:{courseId:c.course.id,tee:{id:'white-female'}}}),1);
assert.equal(c.preferredCourseTee({tees:[{name:'Missing',rating:null,slope:null},{name:'Blue',rating:73,slope:133}]},null),1);
assert.equal(c.preferredCourseTee({tees:[]},null),-1);
assert.equal(c.preferredCourseTee({tees:[{name:'US Open',rating:76,slope:138},{name:'White',rating:71,slope:126}]},null),1);
(async()=>{
  const form={isConnected:true,querySelector:s=>fields[s.match(/name=(\w+)/)?.[1]]},status={textContent:''};
  fields.course={value:'Links'};fields.holes.value='18';c.state={rounds:[]};
  c.document.querySelector=s=>s==='#round-form'?form:s==='#round-form [name=holes]'?fields.holes:s==='#round-course-status'?status:s==='#course-card-controls'?controls:null;
  c.courseRequest=async()=>c.course;
  c.fillRoundCourse({name:'Links',courseId:raw.id});await new Promise(r=>setImmediate(r));
  assert.equal(fields.rating.value,72);assert.equal(fields.slope.value,130);assert(status.textContent.includes('automatically'));
  c.selectCourseTee('1');assert.equal(fields.rating.value,77);assert.equal(fields.slope.value,139);
  c.matchCourseTee('unpublished tee');assert.equal(fields.rating.value,'');assert.equal(fields.slope.value,'');
  let resolve;c.courseRequest=()=>new Promise(r=>resolve=r);c.fillRoundCourse({name:'Links',courseId:raw.id});fields.rating.value='70.1';fields.slope.value='120';resolve(c.course);await new Promise(r=>setImmediate(r));
  assert.equal(fields.rating.value,'70.1');assert.equal(fields.slope.value,'120');
  c.fillRoundCourse({name:'Links',courseId:raw.id});fields.course.value='Different course';resolve(c.course);await new Promise(r=>setImmediate(r));assert.equal(fields.rating.value,'');
  console.log('Passed automatic course rating/slope, explicit tee changes, missing tee clearing, manual-entry preservation and stale course-response guards.');
})().catch(e=>{console.error(e);process.exit(1)});
