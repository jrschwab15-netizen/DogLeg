// Shared by the browser, import checks and the Supabase course-data function.
export function normalizeCourse(raw){
 const text=(v,n=100)=>typeof v==='string'?v.slice(0,n):'',num=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:null;
 const id=text(raw.id),name=text(raw.course_name||raw.name);if(!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)||!name)throw Error('Invalid course');
 const holes=Array.isArray(raw.holes_data)?raw.holes_data:[];
 const tees=(Array.isArray(raw.tees)?raw.tees:[]).slice(0,40).map((t,i)=>{const key=text(t.tee_color||t.tee_name).toLowerCase(),gender=text(t.gender,20);return {id:text(t.tee_key||String(i)),name:text(t.tee_name,40),gender,rating:num(t.course_rating,20,90),slope:num(t.slope,55,155),yardage:num(t.yardage,100,15000),par:num(t.par,18,100),holes:holes.slice(0,18).map(h=>({number:num(h.number,1,18),par:num(h.par,3,7),handicap:num(h.handicap_index,1,18),yards:num(h.yardages?.[key],30,1500)})).filter(h=>Number.isInteger(h.number))}}).filter(t=>t.name);
 const lat=num(raw.lat??raw.latitude,-90,90),lon=num(raw.lng??raw.longitude,-180,180),address=text(raw.address||[raw.city,raw.state].filter(Boolean).join(', '),500);
 return {id,name,holes:[9,18].includes(raw.holes)?raw.holes:null,location:lat!==null&&lon!==null?{lat,lon,address}:null,address,tees,source:'OpenGolfAPI',attribution:'© OpenStreetMap contributors (ODbL 1.0) via OpenGolfAPI'};
}
export function validCourseCard(card){
 if(!card||!(card.courseHoles===undefined||card.courseHoles===null||[9,18].includes(card.courseHoles))||card.source!=='OpenGolfAPI'||typeof card.courseId!=='string'||!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(card.courseId)||!card.tee)return false;
 const t=card.tee,str=(v,n)=>typeof v==='string'&&v.length<=n,num=(v,a,b)=>v===null||typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
 return str(t.id,100)&&str(t.name,40)&&str(t.gender,20)&&num(t.rating,20,90)&&num(t.slope,55,155)&&num(t.yardage,100,15000)&&num(t.par,18,100)&&Array.isArray(t.holes)&&t.holes.length<=18&&new Set(t.holes.map(h=>h.number)).size===t.holes.length&&t.holes.every(h=>Number.isInteger(h.number)&&h.number>=1&&h.number<=18&&num(h.par,3,7)&&num(h.handicap,1,18)&&num(h.yards,30,1500));
}
