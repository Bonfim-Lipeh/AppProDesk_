import {create} from 'zustand';import {persist} from 'zustand/middleware';
export const statusOf=b=>b.status==='cancelada'?'cancelada':(new Date(`${b.date}T${String(b.end).padStart(2,'0')}:00`)<new Date()?'concluída':'ativa');
export const useApp=create(persist((set)=>({
 user:null,screen:'login',spaceId:null,draft:null,lastId:null,bookings:[],geo:null,
 filters:{q:'',city:'Todas',hood:'Todos',type:'Todos',max:150,view:'lista'},
 go:(screen,x={})=>set({screen,...x}),setGeo:geo=>set({geo}),
 setUser:user=>set({user,screen:user?'explore':'login',...(user?{}:{draft:null})}),
 setFilters:f=>set(s=>({filters:{...s.filters,...f}})),
 setDraft:draft=>set({draft}),
 addBooking:b=>set(s=>({bookings:[b,...s.bookings],lastId:b.id,screen:'confirm',draft:null})),
 cancel:id=>set(s=>({bookings:s.bookings.map(b=>b.id===id?{...b,status:'cancelada',cancelledAt:Date.now()}:b)}))}),
 {name:'prodesk-go',partialize:s=>({user:s.user,bookings:s.bookings})}));
