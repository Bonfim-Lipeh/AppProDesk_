import {useEffect,useState} from 'react';import {useApp} from '../store.js';
export const Field=({label,error,children})=><label className="field"><span>{label}</span>{children}{error&&<em role="alert">{error}</em>}</label>;
export const Alert=({children,onRetry})=>children?<div className="alert" role="alert">{children}{onRetry&&<button className="link" onClick={onRetry}>Tentar de novo</button>}</div>:null;
export const Back=({to,title})=>{const go=useApp(s=>s.go);return<header className="top"><button className="ico" aria-label="Voltar" onClick={()=>go(to)}>‹</button><h2>{title}</h2></header>};
export const Tabs=()=>{const{screen,go}=useApp();const T=[['explore','Explorar','⌕'],['mine','Reservas','▤'],['profile','Perfil','☺']];
 return<nav className="tabs">{T.map(([k,l,i])=><button key={k} className={screen===k?'on':''} onClick={()=>go(k)}><b>{i}</b>{l}</button>)}</nav>};
export function Img({src,alt,className}){const[bad,setBad]=useState(false);return bad?<div className={'ph '+className} role="img" aria-label={alt}/>:<img className={className} src={src} alt={alt} onError={()=>setBad(true)}/>}
export function Qr({text}){const n=25;let h=0;for(const c of text)h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;
 const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>>17;h^=h<<5;h>>>=0;return h/4294967296};const cs=[];
 const fin=(x,y)=>{for(const[ox,oy]of[[0,0],[n-7,0],[0,n-7]]){const dx=x-ox,dy=y-oy;if(dx>=-1&&dx<=7&&dy>=-1&&dy<=7)return dx<0||dy<0||dx>6||dy>6?0:(dx%6===0||dy%6===0||(dx>1&&dx<5&&dy>1&&dy<5))?1:0}return null};
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const f=fin(x,y),d=f===null?rnd()>.5:f===1;if(d)cs.push(<rect key={x+'-'+y} x={x} y={y} width="1" height="1"/>)}
 return<svg className="qr" viewBox={`-2 -2 ${n+4} ${n+4}`} role="img" aria-label="QR Code PIX (simulado)"><rect x="-2" y="-2" width={n+4} height={n+4} fill="#fff"/>{cs}</svg>}
export const useToast=()=>{const[m,set]=useState('');useEffect(()=>{if(!m)return;const t=setTimeout(()=>set(''),2200);return()=>clearTimeout(t)},[m]);return[m,set,m&&<div className="toast" role="status">{m}</div>]};
