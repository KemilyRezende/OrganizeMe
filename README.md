# OrganizeMe

OrganizeMe é um sistema web intuitivo para gerenciamento de tarefas (To Do List), projetado para ajudar os usuários a organizarem seu dia a dia de forma eficiente.

## Principais Funcionalidades

  - Criação e gerenciamento de listas de tarefas
  - Adição e conclusão de tarefas
  - Convite e remoção de usuários das listas
  - Notificações sobre atividades nas listas

## Tecnologias Utilizadas

### Backend:

  - Node.js + Express
  - Sequelize (ORM para MySQL)
  - Autenticação JWT
  - Jest (testes automatizados)

### Frontend:

  - React.js
  - CSS Modules (mobile-first)
  - React Router

## Estrutura do projeto

```sh
OrganizeMe/
│── backend/       # Servidor Node.js
│── frontend/      # Interface React
│── docs/          # Documentação do projeto
```

##  Documentação

### Modelo Entidade-Relacionamento (DER)
![Diagrama DER](https://github.com/KemilyRezende/OrganizeMe/blob/main/docs/DER.png)

### Fluxo de Atividades
![Fluxo de Atividades](https://github.com/KemilyRezende/OrganizeMe/blob/main/docs/Diagrama.png)

### Descrição das Tabelas do Banco de Dados
[Descrição das Tabelas do Banco de Dados](https://github.com/KemilyRezende/OrganizeMe/blob/main/docs/descricao_tabelas_bd.md)

### Capturas de Tela

As capturas de tela da aplicação web e mobile podem ser encontradas na pasta `/telas` no diretório raiz do projeto.

## Como Executar

### Backend:

```sh
  cd backend
  npm install
  npm start
```
### Frontend:

```sh
  cd frontend
  npm install 
  npm start
```
A aplicação estará disponível em `http://localhost:3000/`.
