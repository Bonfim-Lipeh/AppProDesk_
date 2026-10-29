import {useApp} from '../store.js';import {getSpace,brl} from '../services/api.js';
const fd=d=>new Date(d+'T12:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'long'});
export const ics=(b,s)=>{const z=h=>b.date.replace(/-/g,'')+'T'+String(h).padStart(2,'0')+'0000';const t=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${s.name} (ProDesk Go)\nLOCATION:${s.address}\nDTSTART:${z(b.start)}\nDTEND:${z(b.end)}\nEND:VEVENT\nEND:VCALENDAR`;
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));a.download=`reserva-${b.id}.ics`;a.click()};
export default function Confirm(){const{bookings,lastId,go,user}=useApp();const b=bookings.find(x=>x.id===lastId),s=getSpace(b.spaceId),p=b.payment;
 return<main className="page center"><div className="okc">✓</div><h1 className="h1">Reserva confirmada!</h1><p className="hint">Enviamos o comprovante para {user.email}</p><code className="code">Código {b.id}</code>
 <div className="receipt"><b>{s.name}</b><small>{s.address}</small><hr/><p>{fd(b.date)} · {b.start}:00 às {b.end}:00</p><p>Pago via {p.method}{p.last4?` ${p.brand||''} •••• ${p.last4}`:''}{p.auth?` · aut. ${p.auth}`:''}{p.txid?` · ${p.txid}`:''}</p>
 <dl className="sum"><dt>Subtotal</dt><dd>{brl(b.subtotal)}</dd><dt>Taxa</dt><dd>{brl(b.fee)}</dd><dt><b>Total pago</b></dt><dd><b>{brl(b.total)}</b></dd></dl><small>Acesso por código liberado 15 min antes do início.</small></div>
 <button className="btn" onClick={()=>go('mine')}>Ver minhas reservas</button><button className="btn ghost" onClick={()=>ics(b,s)}>Adicionar ao calendário</button><button className="link" onClick={()=>go('explore')}>Voltar ao início</button></main>}
