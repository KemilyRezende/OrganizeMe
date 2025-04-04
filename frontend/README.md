# Frontend - OrganizeMe

Este é o frontend da aplicação OrganizeMe, desenvolvido com **React.js** e estilizado com **CSS Modules** e abordagem **mobile-first**.

OrganizeMe é uma plataforma intuitiva de gerenciamento de tarefas, permitindo que os usuários criem listas colaborativas, adicionem tarefas, acompanhem o progresso e recebam notificações em tempo real.

## Tecnologias Utilizadas
  - React.js — Biblioteca JavaScript para construção de interfaces
  - React Router DOM — Navegação entre páginas
  - Axios — Requisições HTTP
  - CSS Modules — Estilização com escopo local
  - Mobile-first Design — Interface responsiva e adaptável

## Como rodar o projeto?

  1. Clone o repositório:
  ```sh
    git clone https://github.com/KemilyRezende/OrganizeMe.git
    cd OrganizeMe/backend
  ```
  2. Instale as dependências:
  ```sh
      npm install 
  ```
  3. Inicie o projeto:
  ```sh
    npm start
  ```
  Ou para rodar em ambiente de desenvolvimento:
  ```sh
    npm run dev
  ```
  O app será iniciado em: http://localhost:5173 (ou porta definida pelo Vite)
  
## Estrutura de Arquivos
```sh
  OrganizeMe/frontend
│
├── assets/
│   └── styles/          # Estilos com CSS Modules
│
├── components/          # Componentes reutilizáveis (botões, cards, notificações)
│
├── pages/               # Páginas principais (login, cadastro, lista, etc.)
│
├── App.jsx              # Configuração de rotas
├── main.jsx             # Ponto de entrada do app
└── index.html           # HTML base

```

## Funcionalidades Implementadas
  - Cadastro e login de usuários com JWT
  - Criação, edição e exclusão de listas
  - Adição e conclusão de tarefas
  - Notificações de ações em tempo real
  - Visualização de listas compartilhadas
  - Interface adaptada para dispositivos móveis

## Design Responsivo

Todo o layout foi pensado com **mobile-first**, garantindo boa usabilidade em smartphones e tablets, além de adaptação para telas maiores.

## Observações
  - O frontend se comunica com o backend na porta `3000` por padrão (`http://localhost:3000`).
  - Certifique-se de que o servidor **backend** esteja rodando antes de iniciar o **frontend**.
  - Os estilos estão organizados em `assets/styles` e associados aos componentes via **CSS Modules**.


