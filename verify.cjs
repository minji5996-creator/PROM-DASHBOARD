const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),removed=[];const node=()=>({value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},append(){},replaceChildren(){},addEventListener(){},scrollIntoView(){},showModal(){},close(){},click(){},remove(){}});
const document={querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},getElementById(id){return this.querySelector('#'+id)},querySelectorAll(){return []},createElement(){return node()},body:node()};
document.querySelector('#channel-filter').value='all';document.querySelector('#sort').value='views';let downloads=[];
const context={document,window:{addEventListener(){},scrollTo(){}},location:{hash:''},localStorage:{getItem(){return null},setItem(){},removeItem(k){removed.push(k)}},Intl,Date,Map,Set,Blob,URL:{createObjectURL(b){downloads.push(b);return 'blob:test'},revokeObjectURL(){}},setTimeout(){},console};
vm.createContext(context);vm.runInContext(fs.readFileSync('data.js','utf8'),context);vm.runInContext(fs.readFileSync('app.js','utf8'),context);const p=context.window.Pulse;
assert.equal(p.D.metricRows.length,3381);assert.equal(p.D.asOfDate,'2026-11-11');assert.equal(p.D.dailyRuns.at(-1).insights.length,5);assert.equal(p.CHANNELS.length,5);assert(p.CHANNELS.some(c=>c.id==='threads'));assert.equal(p.D.accounts.filter(a=>a.followers!=null).reduce((s,a)=>s+a.followers,0),29764);
assert.equal(p.account('facebook').followers,null);assert.equal(p.account('x').followers,0);assert.equal(p.channelViews('youtube').value,42287);assert.equal(p.channelViews('instagram').value,null);assert.equal(p.channelViews('instagram').displayValue,'51.8만');assert.equal(p.channelViews('threads').value,2846);assert.equal(p.channelViews('x').value,112);
assert.equal(p.D.posts.filter(p=>p.id).length,44);assert.equal(new Set(p.D.posts.map(p=>p.key)).size,p.D.posts.length);assert.equal(document.querySelector('#weekly-views').textContent,'확인 필요');assert.equal(document.querySelector('#goal-percent').textContent,'달성률 미산정');assert(removed.includes('pulse-goals-v1'));
function filter(days){document.querySelector('#periods').onclick({target:{closest(){return {dataset:{days:String(days)}}}}})}
filter(7);assert.equal(p.channelViews('youtube').value,7986);assert.equal(p.channelViews('instagram'),undefined);assert(p.contentData().every(p=>p.platform==='youtube'&&p.observed.days===7));
filter(30);assert.equal(p.channelViews('youtube'),undefined);assert.equal(p.channelViews('threads').value,2846);assert.equal(p.contentData().length,0);
filter(1);assert.equal(p.contentData().length,0);assert.equal(p.channelViews('x'),undefined);filter(0);
document.querySelector('#channel-filter').value='instagram';const ig=p.contentData();assert.equal(ig.length,12);assert.equal(ig.find(p=>p.id==='Deo4Mmoxw91').observed.views,5231);const cv=p.conversion(ig.find(p=>p.id==='Deo4Mmoxw91').observed);assert.equal(cv.value,33);assert.equal(cv.partial,true);assert.equal(p.conversion({}).value,null);
document.querySelector('#search').value='없는 검색어';assert.equal(p.contentData().length,0);document.querySelector('#search').value='';document.querySelector('#channel-filter').value='all';
for(const id of ['#export-all','#export-content','#export-channels','#export-history'])document.querySelector(id).onclick();assert.equal(downloads.length,4);
document.querySelector('#target-input').value='12000';document.querySelector('#goal-form').onsubmit({preventDefault(){}});assert.equal(p.target,12000);
assert(!fs.readFileSync('index.html','utf8').includes('SAMPLE DATA'));assert(!fs.existsSync('thumbnails/content-0.jpg'));assert(!fs.readFileSync('app.js','utf8').includes('8420'));
console.log("PASS: source rows, accounts, null/zero, scopes, filters, CSV and goals.");

assert.equal(p.contentData().find(x=>x.key==="youtube:An-n33-njL8").observed.views,33824);filter(7);assert.equal(p.contentData().find(x=>x.key==="youtube:An-n33-njL8").observed.views,6279);filter(0);assert.equal(p.D.dailyRuns.length,18);assert.equal(p.channelViews("facebook").value,null);console.log("PASS: latest post observations, Facebook period, daily history.");

assert.equal(p.D.metricRows.filter(r=>r.collectedAt===p.D.preparedAt).length,228);assert.equal(p.periodRows("facebook").find(r=>r.metric==="reactions").value,null);assert.equal(p.D.accounts.find(a=>a.platform==="threads").followers,2305);console.log("PASS: daily count and conflict/null preservation");

assert.equal(p.account("facebook").status,"blocked");assert.equal(p.D.youtubeLatest.views,12);assert.equal(p.D.audienceRows.filter(r=>r.collectedAt===p.D.preparedAt).length,131);assert.equal(p.D.accounts.filter(a=>a.followers!=null).length,4);console.log("PASS: blocked Facebook, current YouTube, 131 audience observations, 4 verified accounts");

assert(p.D.posts.filter(x=>x.platform==="x").every(x=>x.observations.at(-1).comments===0));console.log("PASS: X zero replies mapped to dashboard comments");

const baseline=JSON.parse(fs.readFileSync('baseline.json','utf8'));const current=p.D;
for(const key of ['metricRows','periodMetrics','audienceRows','dailyRuns'])assert.equal(JSON.stringify(current[key].slice(0,baseline[key].length)),JSON.stringify(baseline[key]),key+' prefix preservation');
for(const prior of baseline.posts){const now=current.posts.find(x=>x.key===prior.key);assert(now,'missing prior post '+prior.key);assert.equal(JSON.stringify(now.observations.slice(0,prior.observations.length)),JSON.stringify(prior.observations),'post observation prefix '+prior.key);assert.equal(JSON.stringify({...now,observations:prior.observations}),JSON.stringify(prior),'old post metadata');}
assert.equal(JSON.stringify(current.youtubeLatest),JSON.stringify(baseline.youtubeLatest));assert.equal(current.youtubeLatest.collectedAt,'2026-11-10T00:17:47.750Z');
const todayRows=current.metricRows.slice(baseline.metricRows.length);assert(todayRows.filter(r=>r.platform==='instagram'&&r.scope==='period').every(r=>r.periodStart===null&&r.periodEnd===null));assert(todayRows.filter(r=>r.platform==='facebook').every(r=>r.value===null&&r.availability==='blocked'));assert(todayRows.filter(r=>r.exact===false&&typeof r.displayValue==='string'&&/[만%]/.test(r.displayValue)).every(r=>r.value===null));
const unresolved=todayRows.filter(r=>r.source==='https://www.instagram.com/insights/media/4022373900670669836/');assert.equal(unresolved.length,14);assert(unresolved.every(r=>r.postId===''));assert.equal(unresolved.find(r=>r.metric==='saves').value,111);
assert.equal(p.periodRows('threads').find(r=>r.metric==='views').periodEnd,'2026-11-10');assert.equal(p.periodRows('youtube').find(r=>r.metric==='views').periodLabel,'last 28 days');assert.equal(todayRows.find(r=>r.platform==='threads'&&r.metric==='followersPublic').value,2306);
assert(fs.readFileSync('README.md','utf8').includes('## 메뉴·키워드 기반 챗봇'));console.log('PASS: exact historical prefixes, post metadata, stale latest date, period semantics, rounded/null and unresolved-media rules');

assert.equal(current.audienceRows.length,665);const active=current.audienceRows.slice(baseline.audienceRows.length).filter(r=>r.platform==='instagram'&&r.group==='activeFollowers');assert.equal(active.length,32);assert(active.every(r=>r.timezone===null&&r.periodStart===null&&r.periodEnd===null));console.log('PASS: 32 verified Instagram activity slots, unspecified timezone preserved');

for(const platform of ['youtube','instagram','threads','x'])assert(current.accounts.find(a=>a.platform===platform).collectedAt===current.preparedAt);
assert.equal(current.dailyRuns.at(-1).date,'2026-11-11');assert.equal(current.posts.length,89);assert.equal(current.periodMetrics.length,777);assert.equal(current.posts.find(p=>p.key==='instagram:Deo1Y5JxMPd').observations.at(-1).saves,741);assert.equal(current.posts.find(p=>p.key==='threads:DcoRjnpkjoJ').observations.at(-1).views,60558);console.log('PASS: final account date, period count, post counts and verified detail metrics');
