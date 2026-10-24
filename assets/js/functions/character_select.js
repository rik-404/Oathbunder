/* Seleção de personagens: roster, ficha, compra/desbloqueio e confirmação de classe. */
(function(root){
  function create(ctx){
    const {
      order,classes,classTypes,getSelected,setSelected,clsImg,upgImg,emIc,
      isUnlocked,missions,unlockCosts,store,getRunMeta,formatTime,formatNumber,
      getPassive,newRun,addCoins,getCoins,unlock,updateCoins,onSelect,setScreen
    }=ctx;
    let buyConfirm='';

    function renderCards(){
      buyConfirm='';
      if(!isUnlocked(getSelected()))setSelected(order.find(isUnlocked)||'guerreiro');
      const wrap=document.querySelector('#classes');
      wrap.innerHTML='';
      order.forEach((k,i)=>{
        const C=classes[k],b=document.createElement('button');
        b.type='button';b.className='ctile';b.id='cc-'+k;b.style.setProperty('--c',C.ui);
        b.setAttribute('aria-pressed',String(k===getSelected()));
        b.innerHTML=`<span class="cic">${clsImg(k)}</span><span class="cname">${C.nome}</span><span class="ctipo">${classTypes[k]}</span>`;
        if(i<10){const kb=document.createElement('i');kb.className='kbd';kb.textContent='1234567890'[i];b.appendChild(kb)}
        b.onclick=()=>selectClass(k);b.ondblclick=()=>newRun(k);
        if(!isUnlocked(k)){
          b.classList.add('locked');
          const lk=document.createElement('div');lk.className='lock';
          if(missions[k]){
            const M=missions[k],pv=M.fmt?M.fmt(M.prog()):formatNumber(M.prog()),gv=M.fmt?M.fmt(M.goal):formatNumber(M.goal);
            lk.innerHTML=`<span class="lk">${emIc('🔒')}</span><b>Missão</b><small>${pv} / ${gv} ${M.label}</small>`;
          }else lk.innerHTML=`<span class="lk">${emIc('🔒')}</span><b>${emIc('🪙')} ${unlockCosts[k]}</b><small>clique para ver</small>`;
          b.appendChild(lk);
        }
        wrap.appendChild(b);
      });
      renderDetail(getSelected());
    }

    function renderDetail(k){
      const C=classes[k],best=store.get('cv_bestT',{}),det=document.querySelector('#chardetail'),locked=!isUnlocked(k);
      det.style.setProperty('--c',C.ui);
      const passive=getPassive(C.passiveId),runs=getRunMeta().runs;
      det.innerHTML=`<div class="cd-top" style="--c:${C.ui}"><span class="cd-ic">${clsImg(k)}</span><div class="cd-id"><h3 style="color:${C.ui}">${C.nome}</h3><span class="cd-tipo">${classTypes[k]}</span></div></div>`+
        `<div class="cd-meta">${best[k]?'★ Recorde '+formatTime(best[k]):'★ Sem recorde ainda'} · ${runs} corrida${runs===1?'':'s'}</div>`+
        `<p class="cd-role">${C.role}</p>`+
        (passive?`<div class="ab"><strong>${upgImg(passive.nome)} ${passive.nome}<small>PASSIVA FIXA</small></strong><span>${passive.desc}</span></div>`:'')+
        `<div class="pips">${Object.entries(C.stats).map(([n,v])=>`<div class="pip-row" style="--c:${C.ui}"><span>${n}</span><i>${'<b class="on"></b>'.repeat(v)}${'<b></b>'.repeat(5-v)}</i></div>`).join('')}</div>`+
        (locked&&missions[k]?`<div class="rec" style="color:var(--gold)">${emIc('🎯')} ${missions[k].desc}<br>Progresso: ${missions[k].fmt?missions[k].fmt(missions[k].prog()):formatNumber(missions[k].prog())} / ${missions[k].fmt?missions[k].fmt(missions[k].goal):formatNumber(missions[k].goal)} ${missions[k].label}</div>`:'')+
        (locked
          ?(missions[k]?`<button class="btn" id="startbtn" type="button" disabled style="opacity:.6;cursor:default">${emIc('🔒')} CUMPRA A MISSÃO</button>`
              :(buyConfirm===k?`<button class="btn" id="startbtn" type="button" style="border-color:var(--gold)">✓ CONFIRMAR COMPRA · ${emIc('🪙')} ${unlockCosts[k]}</button>`
                            :`<button class="btn" id="startbtn" type="button">${emIc('🔓')} DESBLOQUEAR · ${emIc('🪙')} ${unlockCosts[k]}</button>`))
          :`<button class="btn" id="startbtn" type="button">CONFIRMAR</button>`);
      const startBtn=det.querySelector('#startbtn');
      if(startBtn)startBtn.onclick=()=>{
        if(!locked){newRun(k);return}
        if(missions[k])return;
        if(buyConfirm!==k){buyConfirm=k;renderDetail(k);return}
        if(getCoins()>=unlockCosts[k]){addCoins(-unlockCosts[k]);buyConfirm='';unlock(k);renderCards();updateCoins()}
        else{startBtn.textContent='🪙 Ouro insuficiente';buyConfirm=''}
      };
    }

    function selectClass(k){
      if(!classes[k])return;
      setSelected(k);onSelect(k);buyConfirm='';
      document.querySelectorAll('.ctile').forEach(c=>c.setAttribute('aria-pressed',String(c.id==='cc-'+k)));
      renderDetail(k);
    }

    function handleKey(e,activeTile){
      if(e.code==='Escape'){setScreen('title');return true}
      const digit=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0'].indexOf(e.code);
      if(digit>=0&&order[digit]){selectClass(order[digit]);return true}
      const columns=4,N=order.length,index=order.indexOf(getSelected());
      if(e.code==='ArrowRight'){selectClass(order[(index+1)%N]);return true}
      if(e.code==='ArrowLeft'){selectClass(order[(index+N-1)%N]);return true}
      if(e.code==='ArrowDown'){selectClass(order[(index+columns)%N]);return true}
      if(e.code==='ArrowUp'){selectClass(order[(index+N-columns)%N]);return true}
      if(e.code==='Enter'&&!activeTile){newRun(getSelected());return true}
      return false;
    }

    return{renderCards,renderDetail,selectClass,handleKey};
  }
  root.CHARACTER_SELECT={create};
})(typeof window!=='undefined'?window:globalThis);
