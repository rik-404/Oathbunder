const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
const head = `<script>
window.__diag={errs:[]};
window.addEventListener('error',function(e){window.__diag.errs.push('error:'+(e.message||e.type))});
window.addEventListener('unhandledrejection',function(e){window.__diag.errs.push('reject:'+(e.reason&&e.reason.message||e.reason))});
document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='SCRIPT')window.__diag.errs.push('script:'+t.src)},true);
(function(){var ce=console.error;console.error=function(){window.__diag.errs.push('console:'+Array.prototype.join.call(arguments,' '));ce.apply(console,arguments)}})();
try{localStorage.setItem('cv_cls','mago');var u={};['mago','arqueiro','guerreiro','tank','necro','chrono','pistol','dracula','demon','future','human','king'].forEach(function(k){u[k]=1});localStorage.setItem('cv_unlocked',JSON.stringify(u));}catch(e){}
window.requestAnimationFrame=function(){return 0};
</script>`;
const tail = `<script>
setTimeout(function(){
  var out={errors:window.__diag.errs.slice(),classes:Object.keys(window.CLASSES||{}),chars:Object.keys(window.CHARACTERS||{}),mage:null,guerreiro:false,startBtn:false,hudHidden:null,menuHidden:null};
  try{
    var C=window.CLASSES||{};
    if(C.mago)out.mage={role:C.mago.role,ab:C.mago.ab.desc};
    out.guerreiro=!!C.guerreiro;
    var play=document.querySelector('#t-play'); if(play)play.click();
    var start=document.querySelector('#startbtn'); out.startBtn=!!start; if(start)start.click();
    var hud=document.querySelector('#hud'),menu=document.querySelector('#menu');
    out.hudHidden=hud?hud.hidden:null; out.menuHidden=menu?menu.hidden:null;
    out.gameCanvas=!!document.querySelector('#game');
  }catch(e){out.errors.push('diag:'+(e&&e.stack||e))}
  var pre=document.createElement('pre');pre.id='diagout';pre.textContent=JSON.stringify(out);document.body.appendChild(pre);
}, 600);
</script>`;
s = s.replace('<head>', '<head>\n' + head);
s = s.replace('</body>', tail + '\n</body>');
fs.writeFileSync('_diag.html', s);
console.log('wrote _diag.html');
