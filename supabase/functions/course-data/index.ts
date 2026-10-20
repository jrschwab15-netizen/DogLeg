import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {normalizeCourse} from './course-schema.js';
const origins=new Set(['https://doglegclub.com','https://www.doglegclub.com','https://jrschwab15-netizen.github.io','http://127.0.0.1:4173']);
const baseHeaders={'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'GET,OPTIONS','Content-Type':'application/json','Cache-Control':'public, max-age=300'};
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
async function upstream(path:string){const response=await fetch('https://api.opengolfapi.org'+path,{signal:AbortSignal.timeout(12000),headers:{Accept:'application/json','User-Agent':'DoglegClub/1.0 (+https://doglegclub.com)'}});if(!response.ok)throw Error('Course provider unavailable');return response.json()}
Deno.serve(async req=>{
 const origin=req.headers.get('origin');if(origin&&!origins.has(origin))return new Response('Origin not allowed',{status:403});
 const headers={...baseHeaders,...(origin?{'Access-Control-Allow-Origin':origin,Vary:'Origin'}:{}),'Cache-Control':'private, max-age=300'};
 if(req.method==='OPTIONS')return new Response(null,{headers});
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(req.method!=='GET')return reply({error:'Method not allowed'},405);
 const authorization=req.headers.get('authorization')||'';if(!authorization.startsWith('Bearer '))return reply({error:'Sign in to import course data'},401);
 const authClient=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{auth:{persistSession:false}});
 const {data:userData,error:authError}=await authClient.auth.getUser(authorization.slice(7));if(authError||!userData.user||userData.user.is_anonymous)return reply({error:'Sign in to import course data'},401);
 const url=new URL(req.url),id=url.searchParams.get('id'),q=(url.searchParams.get('q')||'').trim();
 try{
  if(id){if(!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id))return reply({error:'Invalid course id'},400);
   const {data:cached}=await db.from('dogleg_course_catalog').select('data,fetched_at').eq('id',id).maybeSingle();
   if(cached&&Date.now()-Date.parse(cached.fetched_at)<30*86400000)return reply(cached.data);
   try{const course=normalizeCourse(await upstream('/api/v1/courses/'+id));if(course.id!==id)throw Error('Course mismatch');const {error}=await db.from('dogleg_course_catalog').upsert({id:course.id,name:course.name,data:course,fetched_at:new Date().toISOString()});if(error)throw error;return reply(course)}catch(e){if(cached)return reply(cached.data);throw e}
  }
  if(q.length<3||q.length>100)return reply({error:'Enter 3–100 characters'},400);
  const term=q.replace(/[\\%_]/g,'\\$&');const {data:cached}=await db.from('dogleg_course_catalog').select('data').ilike('name','%'+term+'%').limit(12);
  const rows=(cached||[]).map(r=>r.data);try{const result=await upstream('/v1/courses/search?q='+encodeURIComponent(q));for(const raw of (result.courses||[]).slice(0,30)){try{const c=normalizeCourse(raw);if(!rows.some(r=>r.id===c.id))rows.push(c)}catch{}}}catch(e){if(!rows.length)throw e}
  return reply({courses:rows.slice(0,12)});
 }catch{return reply({error:'Course data is temporarily unavailable. Manual entry is still available.'},503)}
});
