const fs=require('fs');
const pool=[
['Royal Dornoch',57.88,-4.02],['Le Golf National',48.75,2.08],['Hirono',34.77,135.02],['Bandon Dunes',43.19,-124.39],['Cabot Cliffs',46.26,-61.25],['Cape Kidnappers',-39.64,177.07],['Fancourt',-33.95,22.41],['Sentosa',1.24,103.83],['Rosanna Golf Club',-37.74,145.08],['Burnham Beeches',51.54,-0.64],['Mink Meadows',41.47,-70.63],['Hillandale',36.03,-78.94],['Delhi Golf Club',28.60,77.24],['Sao Paulo Golf Club',-23.67,-46.70],['Lahinch',52.94,-9.35],['Ballybunion',52.50,-9.67],['Kingston Heath',-37.94,145.09],['Valderrama',36.40,-5.33],['Paraparaumu',-40.89,174.98],['Kigali Golf',-1.93,30.10]];
let seed=20261020;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
for(let i=pool.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
const sample=[['Adare Manor',52.56,-8.77],...pool.slice(0,16)];
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}
async function check([q,lat,lon]){
 const start=Date.now(),term=q.replace(/^(the|le|les)\s+/i,'');
 const tasks=await Promise.allSettled([get('https://api.opengolfapi.org/v1/courses/search?q='+encodeURIComponent(term)),get('https://photon.komoot.io/api/?'+new URLSearchParams({q:term,osm_tag:'leisure:golf_course',limit:'8'}))]);
 const a=tasks[0].status==='fulfilled'?tasks[0].value.courses||[]:[],b=tasks[1].status==='fulfilled'?tasks[1].value.features||[]:[];
 const matches=[...a.map(c=>({name:c.name,id:c.id,lat:c.latitude,lon:c.longitude,source:'OpenGolfAPI'})),...b.map(f=>({name:f.properties.name,country:f.properties.country,lat:f.geometry.coordinates[1],lon:f.geometry.coordinates[0],source:'Photon'}))];
 const correct=matches.filter(c=>Math.abs(c.lat-lat)<0.75&&Math.abs(c.lon-lon)<0.75);
 const found=correct.find(c=>c.id);let tees=null,detailError=null;
 if(found)try{const d=await get('https://api.opengolfapi.org/api/v1/courses/'+found.id);tees=d.tees?.length||0}catch(e){detailError=e.message}
 return {query:q,expectedArea:{lat,lon},totalMs:Date.now()-start,foundInExpectedArea:correct.length>0,publishedTeeSets:tees,detailError,matches,errors:tasks.flatMap((t,i)=>t.status==='rejected'?[{source:i===0?'OpenGolfAPI':'Photon',message:t.reason.message}]:[])};
}
(async()=>{
 const results=[];
 for(let i=0;i<sample.length;i+=3){const batch=await Promise.all(sample.slice(i,i+3).map(check));results.push(...batch);for(const r of batch)console.log(JSON.stringify({query:r.query,found:r.foundInExpectedArea,ms:r.totalMs,tees:r.publishedTeeSets,names:r.matches.slice(0,3).map(c=>c.name)}))}
 const report={date:'2026-10-20',seed:20261020,method:'Adare plus a seeded random sample of 16 from 20 international courses; correct-area requires coordinates within 0.75 degrees, not merely any fuzzy result. No journal reads/writes. Public live providers, not a concurrency/load test.',passed:results.filter(r=>r.foundInExpectedArea).length,total:results.length,results};
 fs.writeFileSync('docs/course-search-coverage-20261020.json',JSON.stringify(report,null,2)+'\n');console.log('SUMMARY',report.passed+'/'+report.total);
})().catch(e=>{console.error(e);process.exitCode=1});
