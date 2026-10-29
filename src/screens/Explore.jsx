import {useEffect,useState,useCallback} from 'react';import {useApp} from '../store.js';import {searchSpaces} from '../services/api.js';import {SPACES,TYPES,CITIES} from '../data/spaces.js';
import {Alert,Img,Tabs} from '../components/ui.jsx';import {brl} from '../services/api.js';
export default function Explore(){const{filters:f,setFilters,go,geo,setGeo,user}=useApp();const[list,setList]=useState(null);const[err,setErr]=useState('');const[sel,setSel]=useState(null);const[gm,setGm]=useState('');
 const hoods=['Todos',...new Set(SPACES.filter(s=>f.city==='Todas'||s.city===f.city).map(s=>s.hood))];
 const load=useCallback(()=>{setErr('');setList(null);searchSpaces(f,geo).then(setList).catch(e=>setErr(e.message))},[f,geo]);
 useEffect(()=>{const t=setTimeout(load,200);return()=>clearTimeout(t)},[load]);
 const locate=()=>{setGm('');if(!navigator.geolocation)return setGm('Seu navegador não suporta localização.');
  navigator.geolocation.getCurrentPosition(p=>{setGeo({lat:p.coords.latitude,lng:p.coords.longitude});setGm('Ordenado por proximidade de você.')},()=>setGm('Não foi possível obter sua localização. Escolha uma cidade.'),{timeout:8000})};
 const open=s=>go('detail',{spaceId:s.id});
 return<main className="page"><h1 className="h1">Olá, {user.name.split(' ')[0]}. Onde você quer trabalhar hoje?</h1>
 <input className="search" type="search" placeholder="Buscar por bairro, rua ou nome do espaço" value={f.q} onChange={e=>setFilters({q:e.target.value})} aria-label="Buscar"/>
 <div className="chips" role="group" aria-label="Cidade">{['Todas',...Object.keys(CITIES)].map(c=><button key={c} className={f.city===c?'on':''} onClick={()=>setFilters({city:c,hood:'Todos'})}>{c==='Todas'?'Todas as cidades':c}</button>)}<button onClick={locate}>Perto de mim</button></div>
 <div className="row2"><select aria-label="Bairro" value={f.hood} onChange={e=>setFilters({hood:e.target.value})}>{hoods.map(h=><option key={h}>{h}</option>)}</select>
 <select aria-label="Tipo de espaço" value={f.type} onChange={e=>setFilters({type:e.target.value})}>{['Todos',...TYPES].map(h=><option key={h}>{h}</option>)}</select></div>
 <label className="range">Até {brl(f.max)}/h<input type="range" min="10" max="150" step="5" value={f.max} onChange={e=>setFilters({max:+e.target.value})}/></label>
 {gm&&<p className="hint">{gm}</p>}
 <div className="rowb"><b>{list?`${list.length} espaço${list.length===1?'':'s'} encontrado${list.length===1?'':'s'}`:'Buscando…'}</b><div className="seg sm"><button className={f.view==='lista'?'on':''} onClick={()=>setFilters({view:'lista'})}>Lista</button><button className={f.view==='mapa'?'on':''} onClick={()=>setFilters({view:'mapa'})}>Mapa</button></div></div>
 <Alert onRetry={load}>{err}</Alert>
 {!list&&!err&&[1,2].map(i=><div key={i} className="card sk"/>)}
 {list&&!list.length&&<div className="empty"><p>Nenhum espaço com esses filtros.</p><button className="btn ghost" onClick={()=>setFilters({q:'',city:'Todas',hood:'Todos',type:'Todos',max:150})}>Limpar filtros</button></div>}
 {list&&f.view==='mapa'&&list.length>0&&<MapView list={list} sel={sel} setSel={setSel} open={open}/>}
 {list&&f.view==='lista'&&list.map(s=><Card key={s.id} s={s} open={open}/>)}<Tabs/></main>}
export const Card=({s,open})=><button className="card" onClick={()=>open(s)}><Img className="thumb" src={s.img[0]} alt={s.name}/><div><b>{s.name}</b><small>★ {s.rating} ({s.reviews}){s.dist!=null&&` · ${s.dist.toFixed(1)} km`}</small><small>{s.hood}, {s.city} · {s.type}</small><div className="tags">{s.amenities.slice(0,2).map(a=><i key={a}>{a}</i>)}</div><strong>{brl(s.price)}/h</strong></div></button>;
function MapView({list,sel,setSel,open}){const la=list.map(s=>s.lat),lo=list.map(s=>s.lng),a=Math.min(...la),b=Math.max(...la),c=Math.min(...lo),d=Math.max(...lo);
 const px=(v,mn,mx)=>mx===mn?50:8+(v-mn)/(mx-mn)*84;const s=list.find(x=>x.id===sel);
 return<><div className="map" role="group" aria-label="Mapa dos espaços">{list.map(x=><button key={x.id} className={'pin'+(sel===x.id?' on':'')} style={{left:px(x.lng,c,d)+'%',top:(100-px(x.lat,a,b))+'%'}} onClick={()=>setSel(x.id)} aria-label={x.name}>R$ {x.price}</button>)}</div>
 {s?<Card s={s} open={open}/>:<p className="hint">Toque em um preço para ver o espaço.</p>}</>}
