import {useState} from 'react';import {useForm} from 'react-hook-form';import {zodResolver} from '@hookform/resolvers/zod';
import {loginSchema,signupSchema} from '../schemas.js';import {signIn,signUp} from '../services/api.js';import {useApp} from '../store.js';import {Field,Alert} from '../components/ui.jsx';
export default function Auth({mode}){const setUser=useApp(s=>s.setUser),go=useApp(s=>s.go),up=mode==='signup';const[err,setErr]=useState('');const[show,setShow]=useState(false);
 const{register,handleSubmit,formState:{errors,isSubmitting}}=useForm({resolver:zodResolver(up?signupSchema:loginSchema),mode:'onTouched'});
 const submit=async d=>{setErr('');try{setUser(await(up?signUp:signIn)(d))}catch(e){setErr(e.message)}};
 return<main className="auth"><div className="logo">P</div><h1>ProDesk Go</h1><p className="sub">Encontre e reserve o espaço ideal para trabalhar</p>
 <div className="seg"><button className={!up?'on':''} onClick={()=>go('login')}>Entrar</button><button className={up?'on':''} onClick={()=>go('signup')}>Criar conta</button></div>
 <form onSubmit={handleSubmit(submit)} noValidate>
 {up&&<Field label="Nome" error={errors.name?.message}><input autoComplete="name" placeholder="Como devemos chamar você?" {...register('name')}/></Field>}
 <Field label="E-mail" error={errors.email?.message}><input type="email" autoComplete="email" placeholder="voce@email.com" {...register('email')}/></Field>
 <Field label="Senha" error={errors.password?.message}><div className="pw"><input type={show?'text':'password'} autoComplete={up?'new-password':'current-password'} placeholder={up?'Mínimo 8 caracteres, com letras e números':'Sua senha'} {...register('password')}/><button type="button" className="link" onClick={()=>setShow(!show)}>{show?'Ocultar':'Mostrar'}</button></div></Field>
 {up&&<Field error={errors.terms?.message}><span className="chk"><input type="checkbox" {...register('terms')}/> Li e aceito os Termos de Uso e a Política de Privacidade</span></Field>}
 <Alert>{err}</Alert><button className="btn" disabled={isSubmitting}>{isSubmitting?'Aguarde…':up?'Criar conta':'Entrar'}</button></form>
 <p className="hint">Conexão segura. Não compartilhamos seus dados.</p></main>}
