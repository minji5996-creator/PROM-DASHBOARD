const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const config=JSON.parse(fs.readFileSync('chatbot-flow.json','utf8'));
class Element{
  constructor(tag='div'){this.tagName=tag;this.children=[];this.nodes=new Map();this.listeners={};this.value='';this.textContent='';this.hidden=false;this.dataset={};this.attributes={};this.style={};this.disabled=false;this.innerHTML='';}
  append(...values){this.children.push(...values)}replaceChildren(...values){this.children=[...values]}focus(){}remove(){}click(){this.listeners.click?.({preventDefault(){}})}
  setAttribute(k,v){this.attributes[k]=v}addEventListener(k,fn){this.listeners[k]=fn}
  querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,new Element());return this.nodes.get(selector)}
  querySelectorAll(selector){if(selector==='[data-nav]'||selector==='.chat-navigation button'){if(!this.navs)this.navs=['back','home','reset'].map(action=>{const e=new Element('button');e.dataset.nav=action;return e});return this.navs}if(selector==='button')return this.children.filter(c=>c.tagName==='button');return []}
}
const storage=new Map();function runtime(stored=storage){const document={body:new Element(),createElement:t=>new Element(t)},window={},sessionStorage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)},context={document,window,sessionStorage,URL,AbortController,FormData,setTimeout,clearTimeout,crypto:require('node:crypto').webcrypto,location:{href:'https://minji5996-creator.github.io/PROM-DASHBOARD/'},fetch:async()=>({ok:true,json:async()=>config})};vm.createContext(context);vm.runInContext(fs.readFileSync('contact-client.js','utf8'),context);vm.runInContext(fs.readFileSync('chatbot.js','utf8'),context);return {context,window,root:document.body.children[0],stored}}
const settle=()=>new Promise(r=>setImmediate(r));
(async()=>{
  const a=runtime();await settle();const {resolve}=a.window.PulseChatRules;
  assert.equal(resolve(config,'오늘 조회수 알려줘').next,'today');assert.equal(resolve(config,'이번 주 목표').next,'weekly');assert.equal(resolve(config,'CSV 다운로드').next,'csv');assert.equal(resolve(config,'전환수가 뭐야').next,'conversion');assert.equal(resolve(config,'관리자 로그인').next,'admin');assert.equal(resolve(config,'전혀등록되지않은물음'),null);
  const reached=new Set([config.entry]),queue=[config.entry];while(queue.length){const node=config.nodes[queue.shift()];assert(node.answer&&node.question&&Array.isArray(node.buttons));for(const button of node.buttons){if(button.next){assert(config.nodes[button.next]);if(!reached.has(button.next)){reached.add(button.next);queue.push(button.next)}}else assert.equal(button.action,'link')}}assert.equal(reached.size,Object.keys(config.nodes).length);
  assert.equal(config.fallback,'등록된 안내를 찾지 못했어요. 아래 메뉴를 선택하거나 제작 문의를 남겨주세요.');
  const chat=a.window.PulseChat;chat.go('today','오늘 조회수');assert.equal(chat.getState().path.at(-1),'today');assert(storage.has(chat.key));
  const b=runtime();await settle();assert.equal(b.window.PulseChat.getState().path.at(-1),'today');assert.equal(b.window.PulseChat.getState().messages.length,3);
  b.root.querySelectorAll('[data-nav]')[0].click();assert.equal(b.window.PulseChat.getState().path.at(-1),'home');
  const form=b.root.querySelector('.chat-input-form'),input=b.root.querySelector('#chat-input');input.value='등록되지않은물음';form.listeners.submit({preventDefault(){}});assert.equal(b.window.PulseChat.getState().messages.at(-1).text,config.fallback);
  input.value='example@example.invalid';form.listeners.submit({preventDefault(){}});assert.equal(b.window.PulseChat.getState().path.at(-1),'inquiry');assert(!storage.get(chat.key).includes('example@example.invalid'));
  b.window.PulseChat.reset();assert.equal(storage.has(chat.key),false);assert.equal(b.window.PulseChat.getState().messages.length,1);assert.equal(b.window.PulseChat.getState().path.at(-1),'home');
  const contact=b.window.PulseContact,cfg={...config.contact,enabled:true},value={full_name:'검증용 이름',email:'test@example.invalid',message:'로컬 모의 응답 검증용 문의 내용입니다.',consent:true},id='6553c7de-9841-43f4-a36e-9e28ad60e526';let calls=[];
  assert(contact.validate(value));assert(!contact.validate({...value,consent:false}));assert(!contact.validate({...value,message:'짧음'}));
  await contact.submit(cfg,value,id,async(url,options)=>{calls.push({url,options});return {status:201}});assert(calls[0].url.endsWith('/rest/v1/prom_contact_inquiries'));const body=JSON.parse(calls[0].options.body);assert.equal(body.consent,true);assert(!('status' in body));assert.equal(body.client_request_id,id);assert(!('transcript' in body));assert(!('Authorization' in calls[0].options.headers));
  await assert.rejects(()=>contact.submit(cfg,{...value,consent:false},id,async()=>{throw new Error('must not send')}));await assert.rejects(()=>contact.submit({...cfg,enabled:false},value,id));await assert.rejects(()=>contact.submit(cfg,value,id,async()=>({status:403,json:async()=>({code:'42501'})})));
  assert((await contact.submit(cfg,value,id,async()=>({status:409,json:async()=>({code:'23505'})}))).retried);assert.equal(config.contact.table,'prom_contact_inquiries');assert(config.contact.publishableKey.startsWith('sb_publishable_'));
  const scripts=['chatbot.js','contact-client.js','contact-page.js'].map(p=>fs.readFileSync(p,'utf8')).join('\n');assert(!/api\.openai|generativelanguage|anthropic\.com|chat\/completions/.test(scripts));
  console.log('PASS: all JSON branches; deterministic keywords and exact fallback; back/home/reset; session reload; PII not recorded; consent/length validation; correct shared table; idempotency; error handling; no generative API.');
})().catch(e=>{console.error(e);process.exitCode=1});
