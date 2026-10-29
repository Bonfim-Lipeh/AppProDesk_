import {useEffect,useRef,useState} from 'react';import {useForm} from 'react-hook-form';import {zodResolver} from '@hookform/resolvers/zod';
import {useApp} from '../store.js';import {getSpace,busyHours,today,FEE,brl,createPix,payCard,brandOf} from '../services/api.js';import {cardSchema} from '../schemas.js';
import {Back,Field,Alert,Qr,useToast} from '../components/ui.jsx';
const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d.toISOString().slice(0,10)});
const wd=d=>new Date(d+'T12:00').toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','');
export default function Booking(){const{draft,bookings,addBooking}=useApp();const s=getSpace(draft.spaceId);
 const[date,setDate]=useState(days.find(d=>busyHours(s,d,bookings).size<12)||days[0]);const[start,setStart]=useState(s.hours[0]);const[end,setEnd]=useState(s.hours[0]+1);
 const[method,setMethod]=useState('pix');const[phase,setPhase]=useState('form');const[pix,setPix]=useState(null);const[err,setErr]=useState('');const[ok,setOk]=useState('');const[toast,setToast,T]=useToast();const done=useRef(false);
 const busy=busyHours(s,date,bookings);const hrs=Array.from({length:s.hours[1]-s.hours[0]},(_,i)=>s.hours[0]+i);
 const clash=[];for(let h=start;h<end;h++)if(busy.has(h))clash.push(h);
 const dur=end-start,total=dur*s.price+FEE,valid=dur>0&&!clash.length;
 const finish=payment=>{if(done.current)return;done.current=true;addBooking({id:'PD-'+Math.random().toString().slice(2,7),spaceId:s.id,date,start,end,total,subtotal:dur*s.price,fee:FEE,payment,status:'ativa',createdAt:Date.now()})};
 useEffect(()=>{if(phase!=='pix')return;const t=setTimeout(()=>{setOk('Pagamento PIX confirmado');setTimeout(()=>finish({method:'PIX',txid:pix.txid}),900)},20000);return()=>clearTimeout(t)},[phase]);
 const startPix=async()=>{setErr('');setPhase('processing');try{setPix(await createPix(total));setPhase('pix')}catch(e){setErr(e.message);setPhase('form')}};
 const copy=async()=>{try{await navigator.clipboard.writeText(pix.code);setToast('Código PIX copiado!')}catch{setToast('Não foi possível copiar. Selecione o código manualmente.')}};
 const {register,handleSubmit,setValue,watch,formState:{errors}}=useForm({resolver:zodResolver(cardSchema),mode:'onTouched',defaultValues:{number:'',name:'',expiry:'',cvv:''}});
 const brand=brandOf(watch('number')||'');
 const fmt=(k,fn)=>({...register(k),onChange:e=>setValue(k,fn(e.target.value),{shouldValidate:true,shouldTouch:true})});
 const payCardSubmit=async d=>{setErr('');setPhase('processing');try{const r=await payCard(d,total);setOk('Aprovado com sucesso');setTimeout(()=>finish({method:'Cartão',brand:r.brand,last4:r.last4,auth:r.auth}),900)}catch(e){setErr(e.message);setPhase('form')}};
 if(phase==='processing'||ok)return<main className="page center"><div className={ok?'okc':'spin'}>{ok&&'✓'}</div><h2>{ok||'Processando pagamento…'}</h2><p className="hint">{ok?'Gerando seu recibo…':'Não feche esta tela.'}</p></main>;
 if(phase==='pix')return<main className="page"><Back to="detail" title="Pague com PIX"/><div className="pixbox"><Qr text={pix.code}/><p><b>{brl(total)}</b></p><textarea readOnly rows="4" value={pix.code} aria-label="PIX copia e cola" onFocus={e=>e.target.select()}/>
 <button className="btn" onClick={copy}>Copiar código PIX</button><p className="hint">Aguardando pagamento… confirmação automática em instantes (simulação).</p>
 <button className="btn ghost" onClick={()=>{setOk('Pagamento PIX confirmado');setTimeout(()=>finish({method:'PIX',txid:pix.txid}),900)}}>Simular pagamento aprovado</button></div>{T}</main>;
 return<main className="page"><Back to="detail" title="Reservar espaço"/><div className="mini"><b>{s.name}</b><small>{s.address}</small><strong>{brl(s.price)}/h</strong></div>
 <h3>1. Quando você vai?</h3><div className="dates">{days.map(d=><button key={d} className={d===date?'on':''} onClick={()=>setDate(d)}><small>{wd(d)}</small><b>{d.slice(8)}</b></button>)}</div>
 <div className="row2"><Field label="Início"><select value={start} onChange={e=>{const v=+e.target.value;setStart(v);if(end<=v)setEnd(v+1)}}>{hrs.map(h=><option key={h} value={h}>{h}:00{busy.has(h)?' (ocupado)':''}</option>)}</select></Field>
 <Field label="Fim"><select value={end} onChange={e=>setEnd(+e.target.value)}>{hrs.map(h=>h+1).filter(h=>h>start).map(h=><option key={h} value={h}>{h}:00</option>)}</select></Field></div>
 {clash.length?<Alert>Horário indisponível: {clash.map(h=>h+'h').join(', ')}. Escolha outro intervalo ou dia.</Alert>:<p className="okt">✓ Horário disponível · duração de {dur} {dur>1?'horas':'hora'}</p>}
 <h3>2. Pagamento</h3><div className="seg"><button className={method==='pix'?'on':''} onClick={()=>setMethod('pix')}>PIX</button><button className={method==='card'?'on':''} onClick={()=>setMethod('card')}>Cartão de crédito</button></div>
 {method==='card'&&<form id="cf" onSubmit={handleSubmit(payCardSubmit)} noValidate>
 <Field label={`Número do cartão${brand?' · '+brand:''}`} error={errors.number?.message}><input inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" {...fmt('number',v=>v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim())}/></Field>
 <Field label="Nome no cartão" error={errors.name?.message}><input autoComplete="cc-name" {...register('name')}/></Field>
 <div className="row2"><Field label="Validade" error={errors.expiry?.message}><input inputMode="numeric" placeholder="MM/AA" autoComplete="cc-exp" {...fmt('expiry',v=>{const d=v.replace(/\D/g,'').slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d})}/></Field>
 <Field label="CVV" error={errors.cvv?.message}><input inputMode="numeric" autoComplete="cc-csc" placeholder="123" {...fmt('cvv',v=>v.replace(/\D/g,'').slice(0,4))}/></Field></div>
 <p className="hint">Teste: 4242 4242 4242 4242 aprova. Terminado em 0002 é recusado.</p></form>}
 <h3>3. Resumo</h3><dl className="sum"><dt>{dur} h × {brl(s.price)}</dt><dd>{brl(dur*s.price)}</dd><dt>Taxa de serviço</dt><dd>{brl(FEE)}</dd><dt><b>Total</b></dt><dd><b>{brl(total)}</b></dd></dl>
 <Alert>{err}</Alert><footer className="bar"><button className="btn wide" disabled={!valid} {...(method==='pix'?{onClick:startPix}:{type:'submit',form:'cf'})}>{method==='pix'?`Gerar PIX de ${brl(total)}`:`Pagar ${brl(total)}`}</button></footer>{T}</main>}
