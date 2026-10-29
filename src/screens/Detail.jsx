import {useState} from 'react';import {useApp} from '../store.js';import {getSpace,brl} from '../services/api.js';import {Img,Back} from '../components/ui.jsx';
export default function Detail(){const{spaceId,go,setDraft}=useApp();const s=getSpace(spaceId);const[i,setI]=useState(0);
 return<main className="page nopad"><div className="hero"><Img src={s.img[i]} alt={`Foto ${i+1} de ${s.name}`}/><button className="ico fl" aria-label="Voltar" onClick={()=>go('explore')}>‹</button>
 <button className="count" onClick={()=>setI((i+1)%s.img.length)}>{i+1} / {s.img.length} fotos</button></div>
 <div className="pad"><h1 className="h1">{s.name}</h1><p className="meta">★ {s.rating} · {s.reviews} avaliações · {s.type}</p><p className="meta">{s.address}</p>
 <div className="tags big">{s.amenities.map(a=><i key={a}>{a}</i>)}<i>Até {s.capacity} {s.capacity>1?'pessoas':'pessoa'}</i></div>
 <p>{s.desc}</p><div className="host"><div className="av">{s.host[0]}</div><div><b>Anfitrião: {s.host}</b><small>Identidade verificada · responde em ~1 h</small></div></div>
 <p className="hint">Funcionamento: {s.hours[0]}h às {s.hours[1]}h · Cancelamento grátis até 24 h antes.</p></div>
 <footer className="bar"><div><b>{brl(s.price)}</b><small>/hora</small></div><button className="btn" onClick={()=>{setDraft({spaceId:s.id});go('book')}}>Reservar</button></footer></main>}
