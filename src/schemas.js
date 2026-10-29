import {z} from 'zod';import {luhn,brandOf} from './services/api.js';
export const loginSchema=z.object({email:z.string().min(1,'Informe seu e-mail').email('E-mail inválido'),password:z.string().min(1,'Informe sua senha')});
export const signupSchema=z.object({name:z.string().trim().min(2,'Informe seu nome'),email:z.string().min(1,'Informe seu e-mail').email('E-mail inválido'),
 password:z.string().min(8,'Mínimo de 8 caracteres').regex(/[A-Za-z]/,'Inclua letras').regex(/\d/,'Inclua números'),terms:z.literal(true,{errorMap:()=>({message:'Aceite os termos para continuar'})})});
export const cardSchema=z.object({number:z.string().refine(v=>luhn(v),'Número de cartão inválido'),name:z.string().trim().min(3,'Nome como no cartão').regex(/\s/,'Informe nome e sobrenome'),
 expiry:z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/,'Use MM/AA').refine(v=>{const[m,y]=v.split('/').map(Number);return new Date(2000+y,m)>new Date()},'Cartão vencido'),
 cvv:z.string().regex(/^\d{3,4}$/,'CVV inválido')}).superRefine((d,c)=>{if(brandOf(d.number)==='Amex'?d.cvv.length!==4:d.cvv.length!==3)c.addIssue({path:['cvv'],code:'custom',message:brandOf(d.number)==='Amex'?'Amex usa 4 dígitos':'CVV tem 3 dígitos'})});
