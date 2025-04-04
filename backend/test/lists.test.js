const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../src/models/user");
const List = require("../src/models/list");
const Relation = require("../src/models/relation");
const Task = require("../src/models/task");
const sequelize = require("../src/config/db"); 

describe("Testes de Listas:", () =>{

    beforeAll(async () => {
        await sequelize.sync({ force: true });

      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
        await List.destroy({where: {}});
        await Relation.destroy({where: {}});
        await Task.destroy({where: {}});
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

      it("Deve criar uma lista com sucesso", async () => {
        const res = await request(app).post("/create-list").send({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
        })

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Lista criada com sucesso");
        expect(res.body).toHaveProperty("list");
      });

      it("Deve falhar ao não fornecer dados obrigatórios", async () => {
        const res = await request(app).post("/create-list").send({
            description: "lista de teste",
            deadline: new Date(),
        })

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao criar Lista");
      });

      it("Deve falhar ao criar uma lista devido a um erro inesperado", async () => {

        jest.spyOn(List, "create").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const res = await request(app).post("/create-list").send({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
        })

        List.create.mockRestore();
      });

      it("Deve concluir uma lista com sucesso", async () =>{
        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
        });
        const action = "conclude";
        const res = await request(app).put(`/conclude-list/${list.id}/${action}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Lista concluída com sucesso");

      });

      it("Deve falhar ao tentar concluir uma lista inexistente", async () =>{
        const id = 7;
        const action = "conclude";
        const res = await request(app).put(`/conclude-list/${id}/${action}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");

      });

      it("Deve falhar ao concluir uma lista devido a um erro inesperado", async () => {
        jest.spyOn(List, "update").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "conclude";
        const res = await request(app).put(`/conclude-list/${list.id}/${action}`);
        

        List.update.mockRestore();
      });


      it("Deve reabrir uma lista com sucesso", async () =>{
        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
        });
        const action = "reopen";
        const res = await request(app).put(`/conclude-list/${list.id}/${action}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Lista reaberta com sucesso");

      });

      it("Deve falhar ao tentar reabrir uma lista inexistente", async () =>{
        const id = 7;
        const action = "reopen";
        const res = await request(app).put(`/conclude-list/${id}/${action}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");

      });

      it("Deve falhar ao reabrir uma lista devido a um erro inesperado", async () => {
        jest.spyOn(List, "update").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "reopen";
        const res = await request(app).put(`/conclude-list/${list.id}/${action}`);
        

        List.update.mockRestore();
      });


      it("Deve apagar uma lista com sucesso:", async () =>{

        /*
         * Ao criar uma lista em ambiente de produção uma relação user-list também é criada. 
         * Mais relações são adicionados quando usuários aceitam convites para participar da lista.
         * Quando um usuário apaga a lista sua relação é deletada e apenas quando a lista não
         * está relacionada a nenhum usuário a mesma é apagada do banco de dados.
         */

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const res = await request(app).delete(`/delete-list/${list.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Lista apagada com sucesso");

      });

      it("Deve falhar ao apagar uma lista associada a outro usuário:", async () =>{

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        await Relation.create({ // Suponha a existência de um usuário com ID 5.
          idList: list.id,
          idUser: 5,
        })

        const res = await request(app).delete(`/delete-list/${list.id}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "A lista não foi excluída pois está associada a outro usuário");

      });

      it("Deve falhar ao tentar apagar uma lista inexistente:", async () =>{

        const id = 5;
        const res = await request(app).delete(`/delete-list/${id}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");

      });

      it("Deve falhar ao tentar apagar uma lista deviso a um erro inesperado", async () => {
        jest.spyOn(List, "destroy").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const res = await request(app).delete(`/delete-list/${list.id}`);

        List.destroy.mockRestore();
      });

      it("Deve encontrar os usuários associados a lista com sucesso", async () => {
        const hashPassword = await bcrypt.hash("senha123", 10);

        const user1 = await User.create({
          name: "User",
          email: "teste@example.com",
          password: hashPassword,
        });

        const user2 = await User.create({
          name: "User2",
          email: "teste2@example.com",
          password: hashPassword,
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        await Relation.create({
          idList: list.id,
          idUser: user1.id,
        })

        await Relation.create({
          idList: list.id,
          idUser: user2.id,
        })

        res = await request(app).get(`/list-users/${list.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Usuários encontrados");
        expect(res.body).toHaveProperty("users");
      });

      it("Deve falhar buscar usuários associados a uma lista sem usuários", async () => {
        const hashPassword = await bcrypt.hash("senha123", 10);

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        res = await request(app).get(`/list-users/${list.id}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Nenhuma usuário encontrado para essa lista.");
      });

      it("Deve falhar buscar usuários associados a uma lista inexistente", async () => {
        const hashPassword = await bcrypt.hash("senha123", 10);

        const id = 7;
        res = await request(app).get(`/list-users/${id}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");
      });

      it("Deve falhar ao buscar usuários de uma lista por um erro inesperado", async () => {
        jest.spyOn(User, "findAll").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const hashPassword = await bcrypt.hash("senha123", 10);

        const user1 = await User.create({
          name: "User",
          email: "teste@example.com",
          password: hashPassword,
        });

        const user2 = await User.create({
          name: "User2",
          email: "teste2@example.com",
          password: hashPassword,
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        await Relation.create({
          idList: list.id,
          idUser: user1.id,
        });

        await Relation.create({
          idList: list.id,
          idUser: user2.id,
        });

        res = await request(app).get(`/list-users/${list.id}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao buscar os usuários associados a lista");

        User.findAll.mockRestore();

      });

      it("Deve encontrar as tarefas associadas a uma lista", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        await Task.create({
          idList: list.id,
          name: "Tarefa 1",
          description: "Descrição..",
          deadline: new Date(),
          done: false,
        });

        await Task.create({
          idList: list.id,
          name: "Tarefa 2",
          description: "Descrição..",
          deadline: new Date(),
          done: false,
        }); 

        res = await request(app).get(`/list-tasks/${list.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Tarefas encontradas");
        expect(res.body).toHaveProperty("tasks"); 

      });

      it("Lista sem tarefas", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        res = await request(app).get(`/list-tasks/${list.id}`);

        expect(res.status).toBe(204);
      });

      it("Deve falhar ao buscar tarefas associadas a uma lista inexistente", async () => {

        const id = 8;
        res = await request(app).get(`/list-tasks/${id}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");
      });

      it("Deve falhar ao buscar tarefas associadas a uma lista por um erro inesperado", async () =>{
        jest.spyOn(Task, "findAll").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        await Task.create({
          idList: list.id,
          name: "Tarefa 1",
          description: "Descrição..",
          deadline: new Date(),
          done: false,
        })

        await Task.create({
          idList: list.id,
          name: "Tarefa 2",
          description: "Descrição..",
          deadline: new Date(),
          done: false,
        })

        res = await request(app).get(`/list-tasks/${list.id}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao buscar as tarefas da lista");

        Task.findAll.mockRestore();

      });

      it("Deve atualizar a contagem de tarefas e pendências em uma lista após criar tarefa com sucesso", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "create";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Pendências e tarefas atualizas");

      });

      it("Deve falhar atualizar a contagem de tarefas e pendências em uma lista após criar tarefa por erro inesperado", async () => {
        jest.spyOn(List, "increment").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });
        
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "create";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro atualizar lista:");

        List.increment.mockRestore();

      });

      it("Deve atualizar a contagem de tarefas e pendências em uma lista após reabrir tarefa com sucesso", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "reopen";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Pendências atualizas");

      });

      it("Deve falhar atualizar a contagem de tarefas e pendências em uma lista após reabrir tarefa por erro inesperado", async () => {
        jest.spyOn(List, "increment").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });
        
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "reopen";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro atualizar lista:");

        List.increment.mockRestore();

      });

      it("Deve atualizar a contagem de tarefas e pendências em uma lista após concluir tarefa com sucesso", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "conclude";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Pendências atualizas");

      });

      it("Deve falhar atualizar a contagem de tarefas e pendências em uma lista após concluir tarefa por erro inesperado", async () => {
        jest.spyOn(List, "decrement").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });
        
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "conclude";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro atualizar lista:");

        List.decrement.mockRestore();

      });

      it("Deve atualizar a contagem de tarefas e pendências em uma lista após deletar tarefa com sucesso", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "delete";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Pendências e tarefas atualizas");

      });

      it("Deve falhar atualizar a contagem de tarefas e pendências em uma lista após deletar tarefa por erro inesperado", async () => {
        jest.spyOn(List, "decrement").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });
        
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "delete";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro atualizar lista:");

        List.decrement.mockRestore();

      });

      it("Deve falhar ao atualizar a contagem de tarefas e pendências por ação inválida:", async () => {
        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const action = "ivalida";

        const res = await request(app).put(`/update-task-counter/${list.id}/${action}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Ação inválida.");

      });
      

      it("Deve falhar ao atualizar a contagem de tarefas e pendências em uma lista inexistente", async () => {
        const id = 5;

        const action = "create";

        const res = await request(app).put(`/update-task-counter/${id}/${action}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");

      });
});