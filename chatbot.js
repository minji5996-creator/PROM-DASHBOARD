/* Deterministic JSON rules only. No model, embeddings or external chat API. */
(() => {
  'use strict';
  const KEY='social-pulse-chat-session-v1',normalize=s=>s.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
  function resolve(config,input){const text=normalize(input);for(const rule of config.rules){if(rule.keywords.some(k=>text===normalize(k)||(!rule.action&&text.includes(normalize(k)))))return rule}
    let best=null,score=0;for(const [id,node] of Object.entries(config.nodes)){for(const keyword of node.keywords||[]){const k=normalize(keyword);if(text.includes(k)&&k.length>score){best={next:id};score=k.length}}}return best;
  }
  function cleanState(saved,config){if(!saved||saved.version!==config.version||!Array.isArray(saved.path)||!Array.isArray(saved.messages)||!saved.path.length||saved.path.some(id=>!config.nodes[id]))return null;
    const messages=saved.messages.filter(m=>m&&['user','bot'].includes(m.role)&&typeof m.text==='string').slice(-80).map(m=>({role:m.role,text:m.text.slice(0,3000)}));
    return {version:config.version,open:Boolean(saved.open),path:saved.path.slice(-32),messages};
  }
  window.PulseChatRules={resolve,cleanState,normalize};
  const root=document.createElement('div');root.id='pulse-chat';
  root.innerHTML='<button class="chat-launch" type="button" aria-label="대시보드 안내 챗봇 열기" aria-controls="chat-window" aria-expanded="false"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2 1.3-5.1A8 8 0 1 1 20 11.5Z"/><path d="M7 10h9M7 14h6"/></svg><span>대시보드 안내</span></button><section id="chat-window" class="chat-window" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden><header class="chat-header"><div class="chat-mark">◈</div><div><h2 id="chat-title">SOCIAL PULSE 안내</h2><p>등록된 메뉴로 안내하는 도우미입니다.</p></div><button class="chat-close" type="button" aria-label="대화창 닫기">×</button></header><div class="chat-info">메뉴 · 키워드 안내 / 생성형 AI 미사용</div><div class="chat-body"><div class="chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div><div class="chat-choices" aria-label="다음 선택지"></div><div class="chat-contact"></div></div><div class="chat-navigation"><button type="button" data-nav="back">이전으로</button><button type="button" data-nav="home">처음으로</button><button type="button" data-nav="reset">대화 초기화</button></div><form class="chat-input-form"><label class="sr-only" for="chat-input">질문 입력</label><input id="chat-input" type="text" maxlength="500" autocomplete="off" placeholder="안내를 불러오는 중입니다." disabled><button type="submit" disabled>보내기</button></form><p class="chat-footnote">개인정보는 동의 후 문의 양식에만 입력해 주시기 바랍니다.</p></section>';
  document.body.append(root);const get=s=>root.querySelector(s),panel=get('.chat-window'),launcher=get('.chat-launch'),body=get('.chat-body'),choices=get('.chat-choices'),messages=get('.chat-messages'),contact=get('.chat-contact'),input=get('#chat-input');
  let config,state,busy=false,loaded=false,storageFailed=false;
  const answer=id=>config.nodes[id].answer.replaceAll('{{asOfDate}}',window.SNS_DATA?.asOfDate||'기준일 확인 필요');
  const initial=()=>({version:config.version,open:true,path:[config.entry],messages:[{role:'bot',text:answer(config.entry)}]});
  function save(){if(!loaded)return;try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{storageFailed=true;get('.chat-footnote').textContent='이 브라우저는 세션 저장을 허용하지 않아 새로고침 후 대화가 유지되지 않는 상태입니다.'}}
  function toggle(open){panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));if(state){state.open=open;save()}if(open){get('.chat-close').focus();body.scrollTop=body.scrollHeight}else launcher.focus()}
  launcher.addEventListener('click',()=>toggle(panel.hidden));get('.chat-close').addEventListener('click',()=>toggle(false));root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false)});
  function add(role,text){state.messages.push({role,text});state.messages=state.messages.slice(-80)}
  function navState(){root.querySelectorAll('.chat-navigation button').forEach(b=>b.disabled=busy||(b.dataset.nav==='back'&&state.path.length===1));input.disabled=busy;get('.chat-input-form button').disabled=busy;choices.querySelectorAll('button').forEach(b=>b.disabled=busy)}
  function render(){messages.replaceChildren();for(const m of state.messages){const p=document.createElement('div');p.className='chat-bubble '+m.role;p.textContent=m.text;messages.append(p)}
    choices.replaceChildren();contact.replaceChildren();const id=state.path.at(-1),node=config.nodes[id];
    for(const item of node.buttons||[]){let element;if(item.action==='link'){element=document.createElement('a');try{const url=new URL(item.url,location.href);if(!['http:','https:'].includes(url.protocol))continue;element.href=url.href}catch{continue}element.target='_blank';element.rel='noopener noreferrer'}else{element=document.createElement('button');element.type='button';element.addEventListener('click',()=>choose(item.next,item.label))}element.textContent=item.label;choices.append(element)}
    if(node.action==='inquiry')window.PulseContact.mount(contact,config.contact,{onBusy(value){busy=value;navState()},onSuccess(){add('bot','문의 접수가 완료된 상태입니다. 등록된 담당자가 확인할 수 있는 문의함에 저장된 상태입니다.');save();const bubble=document.createElement('div');bubble.className='chat-bubble bot';bubble.textContent=state.messages.at(-1).text;messages.append(bubble)}});
    navState();body.scrollTop=body.scrollHeight;
  }
  function choose(id,label){if(busy||!config.nodes[id])return;if(label)add('user',label);state.path.push(id);state.path=state.path.slice(-32);add('bot',answer(id));render();save()}
  function navigate(action){if(busy)return;
    if(action==='reset'){try{sessionStorage.removeItem(KEY)}catch{}state=initial();render();input.value='';return}
    if(action==='back'){if(state.path.length<=1)return;state.path.pop();add('bot',answer(state.path.at(-1)))}
    if(action==='home'){state.path=[config.entry];add('bot',answer(config.entry))}render();save();
  }
  root.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));
  get('.chat-input-form').addEventListener('submit',e=>{e.preventDefault();if(!loaded||busy)return;const text=input.value.trim();if(!text)return;input.value='';
    // Personal contact details belong only in the consented inquiry form, not chat history.
    if(/[^\s@]+@[^\s@]+\.[^\s@]+|01[016789][-\s]?\d{3,4}[-\s]?\d{4}/.test(text)){choose('inquiry','개인정보는 문의 양식에 입력');return}
    const rule=resolve(config,text);if(rule?.action){navigate(rule.action);return}add('user',text);
    if(rule?.next){choose(rule.next);return}add('bot',config.fallback);state.path=[config.entry];render();save();
  });
  async function init(){try{const r=await fetch('chatbot-flow.json?v=20261026-1',{cache:'no-cache'});if(!r.ok)throw new Error('flow unavailable');config=await r.json();if(!config.nodes?.[config.entry]||!Array.isArray(config.rules))throw new Error('invalid flow');
      let stored;try{stored=JSON.parse(sessionStorage.getItem(KEY))}catch{}state=cleanState(stored,config)||initial();state.open=stored?state.open:!panel.hidden;loaded=true;
      get('#chat-title').textContent=config.title;get('.chat-header p').textContent=config.subtitle;input.placeholder=config.labels.placeholder;get('.chat-input-form button').textContent=config.labels.submit;get('.chat-close').setAttribute('aria-label',config.labels.close);
      root.querySelectorAll('[data-nav]').forEach(b=>b.textContent=config.labels[b.dataset.nav]);render();panel.hidden=!state.open;launcher.setAttribute('aria-expanded',String(state.open));
      window.PulseChat={getState:()=>JSON.parse(JSON.stringify(state)),reset:()=>navigate('reset'),go:choose,key:KEY};
    }catch{messages.textContent='등록 안내를 불러오지 못한 상태입니다. 페이지를 새로고침하거나 기존 문의 페이지를 이용해 주시기 바랍니다.';const a=document.createElement('a');a.href='https://minji5996-creator.github.io/prom-record/contact.html';a.textContent='기존 문의 페이지 ↗';choices.append(a)}
  }
  init();
})();
