/* Native REST client. Only public project settings are loaded from chatbot-flow.json. */
(() => {
  'use strict';
  const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(v){return Boolean(v&&v.consent===true&&v.full_name?.trim().length>=2&&v.full_name.trim().length<=80&&v.email?.length<=254&&emailPattern.test(v.email)&&v.message?.trim().length>=10&&v.message.trim().length<=5000)}
  async function submit(config,value,requestId,fetcher=fetch){
    if(config.enabled!==true)throw new Error('submission_disabled');
    if(!validate(value)||!UUID.test(requestId))throw new Error('invalid_input');
    const url=new URL(config.supabaseUrl);
    if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||!config.publishableKey.startsWith('sb_publishable_')||config.table!=='prom_contact_inquiries')throw new Error('invalid_config');
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetcher(`${url.origin}/rest/v1/${config.table}`,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({client_request_id:requestId,full_name:value.full_name.trim(),email:value.email.trim(),message:value.message.trim(),consent:true}),signal:controller.signal});
      if(response.status===201||response.status===204)return {ok:true};
      let error;try{error=await response.json()}catch{}
      // The only submitted unique value is client_request_id; reusing it is a retry.
      if(response.status===409&&error?.code==='23505')return {ok:true,retried:true};
      throw new Error(response.status===429?'rate_limit':'submission_failed');
    }finally{clearTimeout(timer)}
  }
  function mount(container,config,{onBusy=()=>{},onSuccess=()=>{}}={}){
    container.replaceChildren();const form=document.createElement('form');form.className='pc-form';
    form.innerHTML='<label>이름 / 회사명<input name="full_name" autocomplete="name" minlength="2" maxlength="80" required></label><label>회신 이메일<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label>문의 내용<textarea name="message" rows="4" minlength="10" maxlength="5000" required placeholder="문의 내용 또는 제작할 작업과 일정을 입력해 주시기 바랍니다."></textarea><small>10~5,000자 · 민감정보 입력은 삼가 주시기 바랍니다.</small></label><div class="pc-trap" aria-hidden="true"><input name="website" autocomplete="off" tabindex="-1" aria-label="비워 두세요"></div><p class="pc-privacy"></p><label class="pc-consent"><input type="checkbox" name="consent" required><span></span></label><button type="submit" class="pc-send">문의 제출</button><p class="pc-status" role="status" aria-live="polite"></p>';
    form.querySelector('.pc-privacy').textContent=config.privacyNote;form.querySelector('.pc-consent span').textContent=config.consent;
    if(config.enabled!==true){form.querySelector('.pc-send').disabled=true;form.querySelector('.pc-status').textContent=config.disabledReason;container.append(form);return {busy:false}}
    let busy=false,requestId=null,fingerprint=null,completed=false;
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(busy||completed||!form.reportValidity())return;
      const values=new FormData(form),value={full_name:String(values.get('full_name')||'').trim(),email:String(values.get('email')||'').trim(),message:String(values.get('message')||'').trim(),consent:values.get('consent')==='on'};
      const status=form.querySelector('.pc-status');if(values.get('website')){status.textContent='문의 입력을 확인해 주시기 바랍니다.';return}
      if(!validate(value)){status.textContent='필수 입력 항목과 개인정보 동의를 확인해 주시기 바랍니다.';return}
      const nextFingerprint=JSON.stringify(value);if(nextFingerprint!==fingerprint){requestId=crypto.randomUUID();fingerprint=nextFingerprint}
      busy=true;onBusy(true);form.querySelector('.pc-send').disabled=true;status.textContent='문의 접수 중입니다.';
      try{await submit(config,value,requestId);completed=true;form.reset();fingerprint=null;requestId=null;status.textContent=config.success;form.querySelector('.pc-send').textContent='접수 완료';onSuccess()}
      catch(error){status.textContent=error.name==='AbortError'||error instanceof TypeError?config.uncertain:config.failure}
      finally{busy=false;onBusy(false);form.querySelector('.pc-send').disabled=completed}
    });container.append(form);return {get busy(){return busy}};
  }
  window.PulseContact={validate,submit,mount};
})();
