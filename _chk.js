// _genicons.js — gera ícones de pixel art 16×16 (PNG, sem dependências)
// uso: node _genicons.js
//   assets/images/icons/<classe>.png     — 12 rostos dos heróis
//   assets/images/icons/upg/<slug>.png   — poderes/melhorias/ícones de interface
const fs=require('fs'),path=require('path'),zlib=require('zlib');

// ---------- encoder PNG minimalista (RGBA 8-bit) ----------
const CRC_T=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xffffffff;for(let i=0;i<b.length;i++)c=CRC_T[(c^b[i])&255]^(c>>>8);return(c^0xffffffff)>>>0}
function chunk(type,data){const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const td=Buffer.concat([Buffer.from(type),data]);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(td));return Buffer.concat([len,td,crc])}