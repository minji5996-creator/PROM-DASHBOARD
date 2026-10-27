const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),removed=[];const node=()=>({value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},append(){},replaceChildren(){},addEventListener(){},scrollIntoView(){},showModal(){},close(){},click(){},remove(){}});
const document={querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},getElementById(id){return this.querySelector('#'+id)},querySelectorAll(){return []},createElement(){return node()},body:node()};
document.querySelector('#channel-filter').value='all';document.querySelector('#sort').value='views';let downloads=[];
const context={document,window:{addEventListener(){},scrollTo(){}},location:{hash:''},localStorage:{getItem(){return null},setItem(){},removeItem(k){removed.push(k)}},Intl,Date,Map,Set,Blob,URL:{createObjectURL(b){downloads.push(b);return 'blob:test'},revokeObjectURL(){}},setTimeout(){},console};
vm.createContext(context);vm.runInContext(fs.readFileSync('data.js','utf8'),context);vm.runInContext(fs.readFileSync('app.js','utf8'),context);const p=context.window.Pulse;
assert.equal(p.D.metricRows.length,1243);assert.equal(p.D.asOfDate,'2026-10-27');assert.equal(p.D.dailyRuns.at(-1).insights.length,5);assert.equal(p.CHANNELS.length,5);assert(p.CHANNELS.some(c=>c.id==='threads'));assert.equal(p.D.accounts.filter(a=>a.followers!=null).reduce((s,a)=>s+a.followers,0),29663);
assert.equal(p.account('facebook').followers,1);assert.equal(p.account('x').followers,0);assert.equal(p.channelViews('youtube').value,87186);assert.equal(p.channelViews('instagram').value,null);assert.equal(p.channelViews('instagram').displayValue,'57.9만');assert.equal(p.channelViews('threads').value,1861);assert.equal(p.channelViews('x').value,111);
assert.equal(p.D.posts.filter(p=>p.id).length,38);assert.equal(new Set(p.D.posts.map(p=>p.key)).size,p.D.posts.length);assert.equal(document.querySelector('#weekly-views').textContent,'확인 필요');assert.equal(document.querySelector('#goal-percent').textContent,'달성률 미산정');assert(removed.includes('pulse-goals-v1'));
function filter(days){document.querySelector('#periods').onclick({target:{closest(){return {dataset:{days:String(days)}}}}})}
filter(7);assert.equal(p.channelViews('youtube').value,9852);assert.equal(p.channelViews('instagram'),undefined);assert(p.contentData().every(p=>p.platform==='youtube'&&p.observed.days===7));
filter(30);assert.equal(p.channelViews('youtube'),undefined);assert.equal(p.channelViews('threads').value,1861);assert.equal(p.contentData().length,0);
filter(1);assert.equal(p.contentData().length,0);assert.equal(p.channelViews('x'),undefined);filter(0);
document.querySelector('#channel-filter').value='instagram';const ig=p.contentData();assert.equal(ig.length,12);assert.equal(ig.find(p=>p.id==='Deo4Mmoxw91').observed.views,5231);const cv=p.conversion(ig.find(p=>p.id==='Deo4Mmoxw91').observed);assert.equal(cv.value,33);assert.equal(cv.partial,true);assert.equal(p.conversion({}).value,null);
document.querySelector('#search').value='없는 검색어';assert.equal(p.contentData().length,0);document.querySelector('#search').value='';document.querySelector('#channel-filter').value='all';
for(const id of ['#export-all','#export-content','#export-channels','#export-history'])document.querySelector(id).onclick();assert.equal(downloads.length,4);
document.querySelector('#target-input').value='12000';document.querySelector('#goal-form').onsubmit({preventDefault(){}});assert.equal(p.target,12000);
assert(!fs.readFileSync('index.html','utf8').includes('SAMPLE DATA'));assert(!fs.existsSync('thumbnails/content-0.jpg'));assert(!fs.readFileSync('app.js','utf8').includes('8420'));
console.log("PASS: source rows, accounts, null/zero, scopes, filters, CSV and goals.");

assert.equal(p.contentData().find(x=>x.key==="youtube:An-n33-njL8").observed.views,50526);filter(7);assert.equal(p.contentData().find(x=>x.key==="youtube:An-n33-njL8").observed.views,7598);filter(0);assert.equal(p.D.dailyRuns.length,4);assert.equal(p.channelViews("facebook").value,1189);console.log("PASS: latest post observations, Facebook period, daily history.");

assert.equal(p.D.metricRows.filter(r=>r.collectedAt===p.D.preparedAt).length,112);assert.equal(p.periodRows("facebook").find(r=>r.metric==="reactions").value,9);assert.equal(p.D.accounts.find(a=>a.platform==="threads").followers,2304);console.log("PASS: daily count and conflict/null preservation");
