import {SPACES,CITIES} from '../data/spaces.js';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const flaky=(p=.06)=>{if(Math.random()<p)throw new Error('Falha de conexão. Verifique sua internet e tente novamente.')};
const rd=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
export const FEE=6;
export async function signUp({name,email,password}){await sleep(600);const u=rd('pd_users')||{},k=email.toLowerCase();
 if(u[k])throw new Error('Este e-mail já está cadastrado. Entre na sua conta.');u[k]={name,email:k,h:hash(password)};localStorage.setItem('pd_users',JSON.stringify(u));return{name,email:k}}
export async function signIn({email,password}){await sleep(500);const u=(rd('pd_users')||{})[email.toLowerCase()];
 if(!u||u.h!==hash(password))throw new Error('E-mail ou senha incorretos.');return{name:u.name,email:u.email}}
const km=(a,b)=>{const r=x=>x*Math.PI/180,d=r(b.lat-a.lat),e=r(b.lng-a.lng),h=Math.sin(d/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(e/2)**2;return 12742*Math.asin(Math.sqrt(h))};
export async function searchSpaces(f,pos){await sleep(350);flaky(.04);const q=f.q.trim().toLowerCase();
 let r=SPACES.filter(s=>(f.city==='Todas'||s.city===f.city)&&(f.hood==='Todos'||s.hood===f.hood)&&(f.type==='Todos'||s.type===f.type)&&s.price<=f.max&&(!q||[s.name,s.hood,s.address,s.type].join(' ').toLowerCase().includes(q)));
 const o=pos||(f.city!=='Todas'?CITIES[f.city]:null);r=r.map(s=>({...s,dist:o?km(o,s):null}));
 return r.sort((a,b)=>o?a.dist-b.dist:b.rating-a.rating)}
export const getSpace=id=>SPACES.find(s=>s.id===id);
export const today=()=>new Date().toISOString().slice(0,10);
export const busyHours=(space,date,bookings=[])=>{const h=hash(space.id+date),b=new Set([8+h%11,8+(h>>4)%11,8+(h>>8)%11]);
 bookings.filter(x=>x.status!=='cancelada'&&x.spaceId===space.id&&x.date===date).forEach(x=>{for(let i=x.start;i<x.end;i++)b.add(i)});
 if(date===today())for(let i=0;i<=new Date().getHours();i++)b.add(i);return b};
const crc=s=>{let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')};
const t=(i,v)=>i+String(v.length).padStart(2,'0')+v;
export async function createPix(amount){await sleep(600);flaky(.04);const txid='PD'+Date.now().toString(36).toUpperCase();
 const p='000201010212'+t('26',t('00','br.gov.bcb.pix')+t('01','pagamentos@prodeskgo.mock'))+'520400005303986'+t('54',amount.toFixed(2))+'5802BR'+t('59','PRODESK GO')+t('60','SAO PAULO')+t('62',t('05',txid))+'6304';
 return{txid,code:p+crc(p)}}
export async function payCard(c,amount){await sleep(1800);flaky(.05);const d=c.number.replace(/\D/g,'');if(d.endsWith('0002'))throw new Error('Cartão recusado pelo emissor. Use outro cartão ou pague com PIX.');
 return{auth:String(hash(d+Date.now())).slice(0,6),brand:brandOf(c.number),last4:d.slice(-4),amount}}
export const luhn=n=>{const d=n.replace(/\D/g,'');if(d.length<13)return false;let s=0;for(let i=0;i<d.length;i++){let x=+d[d.length-1-i];if(i%2){x*=2;if(x>9)x-=9}s+=x}return s%10===0};
export const brandOf=n=>{const d=n.replace(/\D/g,'');return /^4/.test(d)?'Visa':/^(5[1-5]|2[2-7])/.test(d)?'Mastercard':/^3[47]/.test(d)?'Amex':/^(6362|5067|4576|4011)/.test(d)?'Elo':null};
export const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
