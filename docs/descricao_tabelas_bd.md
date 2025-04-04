# Banco de Dados - OrganizeMe

Este documento descreve a estrutura do banco de dados utilizada no projeto **OrganizeMe**. O banco de dados é gerenciado pelo **Sequelize** e utiliza **MySQL** como sistema de gerenciamento de banco de dados.

## Estrutura do Banco de Dados

O banco de dados é composto pelas seguintes tabelas:

### 1. Tabela `users`
Armazena as informações dos usuários cadastrados.

| Campo      | Tipo             | Permite Nulo | Descrição |
|------------|-----------------|--------------|-----------|
| id         | INTEGER         | Não          | Identificador único do usuário (PK, auto-incremento). |
| name       | STRING          | Não          | Nome do usuário. |
| email      | STRING          | Não          | Email do usuário (único). |
| password   | STRING          | Não          | Senha do usuário (hash armazenado no banco). |

---

### 2. Tabela `lists`
Armazena as listas de tarefas criadas pelos usuários.

| Campo      | Tipo             | Permite Nulo | Descrição |
|------------|-----------------|--------------|-----------|
| id         | INTEGER         | Não          | Identificador único da lista (PK, auto-incremento). |
| name       | STRING          | Não          | Nome da lista. |
| description| STRING          | Sim          | Descrição da lista. |
| deadline   | DATE            | Sim          | Prazo para conclusão da lista. |
| tasks      | INTEGER         | Não          | Número total de tarefas na lista (padrão: 0). |
| pendencies | INTEGER         | Não          | Número de tarefas pendentes na lista (padrão: 0). |
| done       | BOOLEAN         | Não          | Indica se a lista foi concluída (padrão: false). |

---

### 3. Tabela `tasks`
Armazena as tarefas associadas a uma lista.

| Campo      | Tipo             | Permite Nulo | Descrição |
|------------|-----------------|--------------|-----------|
| id         | INTEGER         | Não          | Identificador único da tarefa (PK, auto-incremento). |
| idList     | INTEGER         | Não          | Referência para a lista à qual a tarefa pertence (FK). |
| name       | STRING          | Não          | Nome da tarefa. |
| description| STRING          | Sim          | Descrição da tarefa. |
| deadline   | DATE            | Sim          | Prazo de conclusão da tarefa. |
| done       | BOOLEAN         | Não          | Indica se a tarefa foi concluída (padrão: false). |

---

### 4. Tabela `notifications`
Armazena as notificações enviadas aos usuários sobre eventos nas listas.

| Campo      | Tipo             | Permite Nulo | Descrição |
|------------|-----------------|--------------|-----------|
| id         | INTEGER         | Não          | Identificador único da notificação (PK, auto-incremento). |
| type       | INTEGER         | Não          | Tipo da notificação (ver lista abaixo). |
| idList     | INTEGER         | Não          | Referência para a lista associada à notificação (FK). |
| idSender   | INTEGER         | Não          | Usuário que enviou a notificação (FK). |
| idRecipient| INTEGER         | Não          | Usuário que recebeu a notificação (FK). |
| idTask     | INTEGER         | Sim          | Referência para uma tarefa específica, se aplicável (FK). |

#### Tipos de Notificação
1. Convite para participar de uma Lista.
2. Novo usuário se juntou a uma Lista.
3. Remoção de usuário de uma Lista.
4. Lista concluída.
5. Nova tarefa adicionada a uma Lista.
6. Tarefa concluída.
7. Tarefa removida.

---

### 5. Tabela `relations`
Relaciona os usuários às listas das quais fazem parte.

| Campo      | Tipo             | Permite Nulo | Descrição |
|------------|-----------------|--------------|-----------|
| id         | INTEGER         | Não          | Identificador único da relação (PK, auto-incremento). |
| idList     | INTEGER         | Não          | Identificador da lista (FK). |
| idUser     | INTEGER         | Não          | Identificador do usuário (FK). |

---

## Relacionamentos

- Um **usuário** pode estar em várias **listas** (relação `relations`).
- Uma **lista** pode conter várias **tarefas**.
- Uma **notificação** pode estar associada a uma **tarefa** específica ou apenas a uma **lista**.

Com essa estrutura, o banco de dados do OrganizeMe possibilita um gerenciamento eficiente de listas colaborativas e notificações para os usuários.

