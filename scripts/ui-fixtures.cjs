// Static, local-only UI fixtures. Never connects to Supabase or creates accounts.
const fs=require('fs'),vm=require('vm'),path=require('path');
process.chdir(path.resolve(__dirname,'..'));
const template=fs.readFileSync('src/template.html','utf8'),built=fs.readFileSync('standalone.html','utf8'),styles=[];
const element=()=>({textContent:'',addEventListener(){},setAttribute(){}});
const c={console,state:{profile:{name:'Alex Morgan',home:'Home course',goal:20},rounds:[]},tab:'Friends',document:{createElement:element,head:{append:s=>styles.push(s.textContent)},querySelector:()=>null},modal:element(),window:{},URL,URLSearchParams,AbortSignal,setTimeout:()=>0,clearTimeout(){}};
vm.createContext(c);
for(const prefix of ['const icons=','const icon=','const esc=','function heading('])vm.runInContext(template.split('\n').find(line=>line.startsWith(prefix)),c);
vm.runInContext(fs.readFileSync('src/features.js','utf8')+'\n'+fs.readFileSync('src/round-social.js','utf8'),c);
const me='11111111-1111-4111-8111-111111111111',friend='22222222-2222-4222-8222-222222222222';
c.testOwner=me;c.testConnections=[{id:'test-connection',requester:friend,recipient:me,requester_name:'Christopher Wellington-Smythe',recipient_name:'Alex Morgan',status:'accepted'},{id:'test-request',requester:'33333333-3333-4333-8333-333333333333',recipient:me,requester_name:'A friend with a longer display name',recipient_name:'Golf friend',status:'pending'}];
const photo='data:image/jpeg;base64,'+fs.readFileSync('tests/fixtures/layout-sample.jpeg').toString('base64');
c.testPosts=[{user_id:friend,round_id:'fixture',payload:{name:'Christopher Wellington-Smythe',course:'Royal County Down Golf Club — Championship Course',date:'2026-10-20',holes:18,tees:'Championship white',score:84,notes:'A good walk, a few great shots, and a sunset worth staying for.',photos:[photo,photo,photo]}}];
vm.runInContext("cloudUser={id:testOwner};socialOwner=testOwner;socialConnections=testConnections;socialPosts=testPosts;socialStatus='Local UI fixture · no account or cloud data';icons.Courses='<path d=\"M5 18V3m0 0 11 3-11 4\"/>';",c);
let prefix=built.slice(0,built.indexOf('<script>'));
const nav=c.navigationItems();prefix=prefix.replace(/<nav[^>]*>.*?<\/nav>/s,'<nav aria-label="Main navigation">'+nav+'</nav>');
const extra='<style>'+styles.join('\n')+'\n'+fs.readFileSync('src/layout.css','utf8')+'</style>';
prefix=prefix.replace('</head>',extra+'</head>');
for(const [name,reset] of [['friends',false],['friends-empty',true]]){
 if(reset)vm.runInContext('socialConnections=[];socialPosts=[];',c);
 const html=prefix.replace(/<main[^>]*><\/main>/,'<main id="main" class="shell">'+c.friendsFeed()+'</main>')+'</body></html>';
 fs.mkdirSync('dist/ui-fixtures',{recursive:true});fs.writeFileSync('dist/ui-fixtures/'+name+'.html',html);
}
console.log('Static local UI fixtures: /__qa/friends and /__qa/friends-empty');
