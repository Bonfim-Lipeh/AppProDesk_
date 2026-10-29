# ProDesk Go (web)
`npm install && npm run dev` → http://localhost:5173
Stack: Vite + React 18, Zustand (persist), React Hook Form + Zod.
Estrutura: src/data (mock SP/Sorocaba) · src/services/api.js (auth, busca/geo, disponibilidade, PIX, cartão, falhas simuladas) · src/schemas.js · src/store.js · src/screens · src/components.
Teste: cartão 4242 4242 4242 4242 aprova; final 0002 é recusado. Falhas de rede simuladas (~4-6%) mostram "Tentar de novo".
Para produção: trocar src/services/api.js por backend real (auth, PSP de pagamento, banco de dados).
