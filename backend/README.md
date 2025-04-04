# Backend - OrganizeMe

Este é o backend da aplicação OrganizeMe, desenvolvido com **Node.js**, **Express** e **Sequelize**.
OrganizeMe é um site simples e intuitivo de gerenciamento de tarefas (To Do List), projetado para ajudar os usuários a organizarem seu dia a dia de forma eficiente, podendo colaborar em listas com outras pessoas, atribuir tarefas e acompanhar o progresso.

## Tecnologias Utilizadas

  - Node.js — Runtime JavaScript
  - Express.js — Framework web para Node
  - Sequelize — ORM para MySQL
  - MySQL — Banco de dados relacional
  - Jest — Testes automatizados
  - dotenv — Variáveis de ambiente
  - CORS — Compartilhamento de recursos entre origens diferentes

## Configuração do ambiente

  1. Clone o repositório:
  ```sh
    git clone https://github.com/KemilyRezende/OrganizeMe.git
    cd OrganizeMe/backend
  ```
  2. Instale as dependências:
  ```sh
      npm install 
  ```
  3. Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
    ```sh
         JWT_SECRET=secret
         PORT=3000
         DB_NAME=organizeme
         DB_USER=root
         DB_PASS=123456DB_HOST=localhost
         DB_PORT=3306
         NODE_ENV=prod
    ```
    ⚠️ Ajuste as informações do banco de dados conforme sua configuração local.
  4. Configure o banco de dados:
    Certifique-se de ter o MySQL rodando.
  5. Inicie o servidor:
  ```sh
      node index.js
  ```

## Estrutura de arquivos:
```sh
OrganizeMe/backend
│
├── controllers/       # Lógica das rotas
├── models/            # Definição das entidades (Sequelize)
├── routes/            # Rotas da API
├── tests/             # Testes com Jest
├── .env               # Variáveis de ambiente
├── app.js             # Instância do Express
└── index.js          # Ponto de entrada do servidor

```

## Funcionalidades da API

A **API** do OrganizeMe oferece suporte a:
  - Autenticação de usuários (login com **JWT**)
  - Criação e gerenciamento de listas de tarefas
  - Convites para colaboração em listas
  - Notificações entre usuários
  - Operações CRUD para usuários, listas e tarefas

## Testes:

Para rodar os testes automatizados com **Jest**:

```sh
    npm test
```



