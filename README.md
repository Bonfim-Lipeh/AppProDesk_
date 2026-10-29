# AppProDesk 🏢💼


> Uma plataforma mobile dedicada à locação flexível de espaços comerciais e coworkings, conectando profissionais, freelancers e empresas a salas de reunião, estações de trabalho e escritórios privativos de forma ágil e segura.

---

## 💡 Sobre o Projeto

O **AppProDesk** nasce com a proposta de descomplicar o acesso a infraestruturas de trabalho sob demanda. Inspirado nos modelos de economia compartilhada de grandes plataformas de hospedagem, o aplicativo foca especificamente no mercado imobiliário comercial, permitindo que proprietários de espaços anunciem salas ou estações ociosas e que clientes encontrem o ambiente ideal para suas demandas de trabalho ou reuniões presenciais.

---

## ✨ Funcionalidades Principais

- **Busca e Descoberta:** Filtre espaços comerciais por localização, capacidade de pessoas, comodidades (Wi-Fi de alta velocidade, projetores, café, salas de reunião) e faixa de preço.
- **Visualização Detalhada:** Páginas de anúncios contendo galeria de fotos, descrição completa da infraestrutura, regras do espaço e avaliações de outros usuários.
- **Sistema de Reservas:** Fluxo intuitivo para agendamento e aluguel de espaços por hora, diária ou períodos personalizados.
- **Gestão de Anúncios:** Painel voltado para proprietários cadastrarem, gerenciarem e acompanharem o status de suas salas e coworkings disponíveis.
- **Perfil do Usuário:** Histórico de reservas ativas e passadas, além de gerenciamento de dados cadastrais.

---

## 🔒 Segurança, DevOps e DevSecOps

O desenvolvimento do **AppProDesk** foi estruturado unindo os princípios de **DevOps** e **DevSecOps**, integrando a segurança de forma transversal desde a concepção do código em Java até a entrega da aplicação mobile. Diferente de fluxos tradicionais onde a segurança é aplicada apenas no final, a arquitetura do projeto prioriza a mitigação proativa de vulnerabilidades e a aplicação de soluções práticas de desenvolvimento seguro. Isso inclui a prevenção rigorosa contra injeções de código malicioso (**SQL Injection**), a implementação robusta de **autenticação de dois fatores (2FA)** para garantir a identidade dos usuários, e práticas estritas de criptografia e tratamento para o **armazenamento e gerenciamento seguro de dados**, assegurando que informações sensíveis de reservas e perfis corporativos permaneçam protegidas contra acessos não autorizados.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi estruturado utilizando as melhores práticas de desenvolvimento mobile e engenharia de software:

- **Linguagem:** [Java](https://github.com/Bonfim-Lipeh/AppProDesk_)
- **Plataforma:** Android
- **Controle de Versão:** Git & GitHub

---

## 📂 Estrutura do Repositório

```text
AppProDesk_/
├── .ideia/                # Configurações e rascunhos de planejamento do projeto
├── AppProdesk-principal/  # Código-fonte principal da aplicação Android
└── README.md              # Documentação do projeto

`npm install && npm run dev` → http://localhost:5173
Stack: Vite + React 18, Zustand (persist), React Hook Form + Zod.
Estrutura: src/data (mock SP/Sorocaba) · src/services/api.js (auth, busca/geo, disponibilidade, PIX, cartão, falhas simuladas) · src/schemas.js · src/store.js · src/screens · src/components.
Teste: cartão 4242 4242 4242 4242 aprova; final 0002 é recusado. Falhas de rede simuladas (~4-6%) mostram "Tentar de novo".
Para produção: trocar src/services/api.js por backend real (auth, PSP de pagamento, banco de dados).
