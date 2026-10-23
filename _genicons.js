// _genicons.js — gera ícones de pixel art 16×16 (PNG, sem dependências) para as 12 classes
// uso: node _genicons.js  →  assets/images/icons/<classe>.png
const fs=require('fs'),path=require('path'),zlib=require('zlib');

// ---------- encoder PNG minimalista (RGBA 8-bit) ----------
const CRC_T=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xffffffff;for(let i=0;i<b.length;i++)c=CRC_T[(c^b[i])&255]^(c>>>8);return(c^0xffffffff)>>>0}
function chunk(type,data){const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const td=Buffer.concat([Buffer.from(type),data]);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(td));return Buffer.concat([len,td,crc])}
function png(w,h,rgba){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;
  const raw=Buffer.alloc((w*4+1)*h);
  for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;rgba.copy(raw,y*(w*4+1)+1,y*w*4,(y+1)*w*4)}
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))])}

// ---------- desenhos: 16 linhas × 16 chars ('.' = transparente) ----------
// cada char = 1 cor da paleta da classe (coletadas dos models/skins reais do projeto)
const I={
// Aurelion — mago: chapéu roxo com faixa dourada, olhos violeta brilhando, túnica escura
mago:{pal:{P:0x4a3290,G:0xf2b84b,S:0xe8b48a,V:0xa58bff,M:0x5a3a2a,R:0x3a2870},rows:[
'.......P........',
'......PPP.......',
'......PPPPP.....',
'.....PPPPPPP....',
'.....PPPPPPP....',
'....GGGGGGGGG...',
'...GGGGGGGGGGG..',
'..GGGGGGGGGGGGG.',
'..SSSSSSSSSSSS..',
'..SSSSSSSSSSSS..',
'..SSVVSSSSVVSS..',
'..SSVVSSSSVVSS..',
'..SSSSSSSSSSSS..',
'..SSSMMMMMMSSS..',
'..SSSSSSSSSSSS..',
'...RRRRRRRRRR...']},
// Oliver — arqueiro: capuz verde, faixa de couro na testa, máscara cinza, olhos verdes brilhando
arqueiro:{pal:{H:0x155343,T:0x4a2e1d,S:0xecc99d,E:0x9be36a,M:0x262828,D:0x151a1a,C:0x1a6151,U:0x275447},rows:[
'.....HHHHHHH....',
'....HHHHHHHHH...',
'...HHHHHHHHHHH..',
'...HHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HSTTTTTTTSSH..',
'..HSSSSSSSSSSH..',
'..HEESSSSEESSH..',
'..HEESSSSEESSH..',
'..HMMMMMMMMMMH..',
'..HMMMDDDDMMM...',
'..HCCCCCCCCCH...',
'..UUUUUUUUUUUU..',
'.UUUUUUUUUUUUUU.',
'.UUUUUUUUUUUUUU.',
'.UUUUUUUUUUUUUU.']},
// Darian — guerreiro: capacete de aço fechado, fenda escura, crista vermelha (assinatura)
guerreiro:{pal:{H:0xbcc5cc,B:0x828c99,k:0x454a57,R:0xd23b2f},rows:[
'.......RR.......',
'......RRRR......',
'......RRRR......',
'.....RRHHHRR....',
'....HHHHHHHHHH..',
'...HHHHHHHHHH...',
'..HHHHHHHHHHHH..',
'..HHHkkkkkkHHH..',
'..HHHkkkkkkHHH..',
'..HHHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..BBBBBBBBBBBB..',
'..BBBBBBBBBBBB..',
'..BBBBBBBBBBBB..',
'....BBBBBBBB....']},
// Brom — tanque: elmo pesado cinza, visor azul brilhando, placas
tank:{pal:{M:0x5d6672,L:0x6d7682,D:0x454b55,V:0x2f5fa8,v:0x6fa8ff},rows:[
'..DDDDDDDDDDDD..',
'.DMMMMMMMMMMMD..',
'.DMMLLLLLLLLMD..',
'DMMMMMMMMMMMMMM.',
'DMMMMMMMMMMMMMM.',
'DMMMMMMMMMMMMMM.',
'DDDVVVVVVVVVVVDD',
'DDDVvvvvvvvvvvVD',
'DMMMMMMMMMMMMMM.',
'DMMMDMMMMMMMDMM.',
'DMMMMMMMMMMMMMM.',
'.DMMMDMMMMMMDMM.',
'.DMMMMMMMMMMMD..',
'..DDDDDDDDDDDD..',
'..DDDDDDDDDDDD..',
'...DDDDDDDDDD...']},
// Necronus — necromante: caveira com olhos verdes brilhando dentro do capuz
necro:{pal:{H:0x403e39,B:0xcabfa1,d:0x9c9272,G:0x8ff0b0,K:0x0f0d0b,W:0xf2f2f2,R:0x262220},rows:[
'...HHHHHHHHHH...',
'..HHHHHHHHHHHH..',
'..HHBBBBBBBBHH..',
'..HHBBBBBBBBHH..',
'.HHBBBBBBBBBBHH.',
'.HHBBBBBBBBBBHH.',
'.HBKGGKBBKGGKH..',
'.HBKGGKBBKGGKH..',
'.HBBBBBBBBBBBBH.',
'.HBBBBKKKKBBBBH.',
'.HBdBBBBBBBdBH..',
'.HBdWWBWWBWWBdH.',
'.HBdWWBWWBWWBdH.',
'.HBdBBBBBBBdBH..',
'..HHHHHHHHHHHH..',
'....RRRRRRRR....']},
// Vespera — cronomante: capuz verde-escuro com borda dourada, rosto na sombra, olhos esmeralda
chrono:{pal:{H:0x26423b,S:0x22302a,E:0x60e651,G:0xbdbd96,M:0x121a16,R:0x0c231c},rows:[
'.....HHHHHHH....',
'....HHHHHHHHH...',
'...HHHHHHHHHHH..',
'...HHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HHGGGGGGGGHH..',
'..HSSSSSSSSSSH..',
'..HSEESSSSEESH..',
'..HSEESSSSEESH..',
'..HSSSSSSSSSSH..',
'..HSSSSMMSSSSH..',
'..HSSSSSSSSSSH..',
'..HHSSSSSSSHHH..',
'...HHHHHHHHHH...',
'..RRRRRGGRRRRR..',
'..RRRRRGGRRRRR..']},
// Cassian — pistoleiro: chapéu de cowboy marrom com faixa dourada, bigode, casaco
pistol:{pal:{H:0x4a2f1e,T:0xe0a94f,S:0xc08a5f,h:0x9c6b48,K:0x2a1a10,D:0x5a3a24,C:0x6e4a2e},rows:[
'....HHHHHHHH....',
'...HHHHHHHHHH...',
'...HHHHHHHHHH...',
'...HTTTTTTTTH...',
'..HHHHHHHHHHHH..',
'.HHHHHHHHHHHHHH.',
'.HhhhhhhhhhhhhH.',
'.SSSSSSSSSSSSSS.',
'.SSKKSSSSSSKKSS.',
'.SSKKSSSSSSKKSS.',
'.SSSDDDDDDDSSSS.',
'.SSSSSSSSSSSSSS.',
'.SSSSSSSSSSSSSS.',
'..CCCCCCCCCCCC..',
'..CCCCCTTCCCCC..',
'..CCCCCCCCCCCC..']},
// Vlad — drácula: franja em pico, pele pálida, olhos vermelhos brilhando, presas, colarinho carmim
dracula:{pal:{K:0x141414,S:0xe7ae82,R:0xff2a2a,M:0x5a2a2a,W:0xf2e4c2,C:0x55000a,B:0xd8d8d8},rows:[
'...KKKKKKKKKK...',
'..KKKKKKKKKKKK..',
'.KKKKKKKKKKKKKK.',
'.KKKKKKKKKKKKKK.',
'.KKKKKKSSKKKKKK.',
'.KKKSSSSSSSSKKK.',
'.KKSSSSSSSSSSKK.',
'.KSSRRSSSSRRSSK.',
'.KSSRRSSSSRRSSK.',
'.KSSSSSSSSSSSSK.',
'.KSSSMMMMMMSSSK.',
'.KSSSMWMWWWMSSS.',
'.KSSSSSSSSSSSSK.',
'..CCSSSSSSSSCC..',
'.CCCCKWWWWKCCCC.',
'.CCCCCKBBBKCCCC.']},
// Castiel — demônio: cabeça negra, chifres de osso, olhos vermelhos ardendo, presas
demon:{pal:{K:0x121212,D:0x090909,T:0xc6bdac,R:0xec1a00,M:0x8d0000,W:0xfafafa},rows:[
'..T..........T..',
'..TT........TT..',
'...TT......TT...',
'..TTTKKKKKKTTT..',
'.TTKKKKKKKKTT...',
'.TTKKKKKKKKKTT..',
'..KKKKKKKKKKKK..',
'..KKRRKKKKRRKK..',
'..KKRRKKKKRRKK..',
'..KKKKKKKKKKKK..',
'..KKKKKKKKKKKK..',
'..KKMMMMMMMMKK..',
'..KKWMWMWMWMKK..',
'..KKKKKKKKKKKK..',
'...KKKKKKKKKK...',
'....DDDDDDDD....']},
// Smith — futurista: capacete tech com visor ciano brilhando, luzes no peito
future:{pal:{D:0x1c2b3a,H:0x24384a,C:0x3bf0d0,K:0x0a1420},rows:[
'....DDDDDDDD....',
'...DDHHHHHHHDD..',
'..DDHHHHHHHHDD..',
'..DHHHHHHHHHHD..',
'.DHHHHHHHHHHHHD.',
'.DHCCCCCCCCCCHD.',
'.DHHCCCCCCCCHHD.',
'.DHHHHHHHHHHHHD.',
'.DHHHHKKKKHHHHD.',
'.DHHHHHHHHHHHHD.',
'.DHHHHHHHHHHHHD.',
'..DHHHHHHHHHHD..',
'..DKKKKKKKKKKD..',
'...KKKKKKKKKK...',
'..KKKCCKKKKCKK..',
'..KKKKKKKKKKKK..']},
// Zé — humano: cabelo marrom, camisa turquesa, sorriso (sem super-poder, literalmente ele)
human:{pal:{H:0x4a2f1e,S:0xc08a5f,h:0xa9744c,K:0x2a1a10,M:0x7a4a2a,T:0x12b5b5,t:0x0e8a8a},rows:[
'...HHHHHHHHHH...',
'..HHHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HHHHHHHHHHHH..',
'..HHSSSSSSSSHH..',
'..HSSSSSSSSSSH..',
'..SSSSSSSSSSSS..',
'..SSKKSSSSKKSS..',
'..SSKKSSSSKKSS..',
'..SSSSSSSSSSSS..',
'..SSSSShhSSSSS..',
'..SSSMMMMMMSSS..',
'..SSSSSSSSSSSS..',
'..TTSSSSSSSSTT..',
'.TTTTTTTTTTTTTT.',
'.TTTTttTTttTTTT.']},
// Midas — rei: coroa dourada com gemas, barba branca, olhos azuis, manto vermelho
king:{pal:{G:0xe3ab28,R:0xdc0011,A:0x8c6639,a:0x66492c,S:0xc48b6a,h:0xa9744c,B:0x1a3fd1,W:0xf2f2f2,Y:0xd9d9d9,D:0x990000},rows:[
'...G...GG...G...',
'..GG..GGGG..GG..',
'.GGGGGGGGGGGGGG.',
'.GGGRGGGRGGGRGG.',
'.AaAaAaAaAaAaAa.',
'..AASSSSSSSSAA..',
'..ASBBSSSSBBASA.',
'..ASBBSSSSBBASA.',
'..ASSShhhhSSSSA.',
'..AWWWWWWWWWWWA.',
'.AWWWWWWWWWWWWA.',
'.AWWYWWWWWWYWA..',
'.AWWWWWWWWWWWWA.',
'..WWWWWWWWWWWW..',
'...WWWWWWWWWW...',
'..DDDDDDDDDDDD..']}
};

const out=path.join('assets','images','icons');fs.mkdirSync(out,{recursive:true});
let bad=0;
for(const[k,d]of Object.entries(I)){
  if(d.rows.length!==16){console.log('ERRO',k,'linhas:',d.rows.length);bad++;continue}
  const px=Buffer.alloc(16*16*4);
  d.rows.forEach((row,y)=>{
    if(row.length!==16){console.log('ERRO',k,'linha',y,'tem',row.length,'chars:',JSON.stringify(row));bad++;return}
    row.split('').forEach((ch,x)=>{
      if(ch==='.')return;
      const c=d.pal[ch];if(c===undefined){console.log('ERRO',k,'linha',y,'char desconhecido:',ch);bad++;return}
      px[(y*16+x)*4+0]=(c>>16)&255;px[(y*16+x)*4+1]=(c>>8)&255;px[(y*16+x)*4+2]=c&255;px[(y*16+x)*4+3]=255;});});
  const p=path.join(out,k+'.png');
  fs.writeFileSync(p,png(16,16,px));
  console.log('ok:',k+' -> '+p+' ('+fs.statSync(p).size+' bytes)')}
console.log(bad?'ERROS: '+bad:'ICONES_OK — 12/12 gerados');process.exit(bad?1:0);
