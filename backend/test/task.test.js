const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const List = require("../src/models/list");
const Task = require("../src/models/task");
const sequelize = require("../src/config/db"); 

describe("Testes relacionados a criação e deleção de tarefas", () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });

      });
    
    beforeEach(async () => {
        await List.destroy({where: {}});
        await Task.destroy({where: {}});
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

    it("Deve criar uma tarefa com sucesso", async () => {

        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });

        const res = await request(app).post("/create-task").send({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição 1",
            deadline: new Date(),
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Tarefa criada com sucesso");
        expect(res.body).toHaveProperty("task");
    }); 

    it("Deve falhar ao criar uma tarefa com uma lista inexistente", async () => {
        const res = await request(app).post("/create-task").send({
            idList: 7,
            name: "Tarefa 1",
            description: "Descrição 1",
            deadline: new Date(),
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada.");
    });

    it("Deve falhar ao criar uma tarefa por erro inesperado", async () => {
        jest.spyOn(Task, "create").mockImplementation(() => {
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

        const res = await request(app).post("/create-task").send({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição 1",
            deadline: new Date(),
        });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao criar tarefa");

        
        Task.create.mockRestore();
  
    });

    it("Deve deletar uma tarefa com sucesso", async () => {
        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 3,
            done: false,
          });
  
        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

        const res = await request(app).delete(`/delete-task/${task.id}`);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Tarefa apagada com sucesso");

    });

    it("Deve falhar ao deletar uma tarefa inexistente", async () => {
        const id = 8;

        const res = await request(app).delete(`/delete-task/${id}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Tarefa não encontrada");
    });

    it("Deve falhar ao apagar uma tarefa por um erro inesperado", async () => {

        jest.spyOn(Task, "destroy").mockImplementation(() => {
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
  
        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

        const res = await request(app).delete(`/delete-task/${task.id}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao apagar a tarefa");

        Task.destroy.mockRestore();
    });

    it("Deve concluir uma tarefa com sucesso", async () => {
        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 3,
            done: false,
          });
  
        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

        const action= "conclude";

        const res = await request(app).put(`/conclude-task/${task.id}/${action}`);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Tarefa concluída com sucesso");
    });

    it("Deve falhar ao concluir uma tarefa inexistente", async () => {
        const id = 2;

        const action= "conclude";

        const res = await request(app).put(`/conclude-task/${id}/${action}`);
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Tarefa não encontrada");
    });

    it("Deve falhar concluir uma tarefa por erro inesperado", async () => {

        jest.spyOn(Task, "update").mockImplementation(() => {
            throw new Error("Erro inesperado"); 
          });

        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 3,
            done: false,
          });
  
        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

        const action= "conclude";

        const res = await request(app).put(`/conclude-task/${task.id}/${action}`);
        
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro concluir tarefa:");

        Task.update.mockRestore();
    });

    it("Deve reabrir uma tarefa com sucesso", async () => {
        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 3,
            done: false,
          });
  
        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

          const action= "reopen";

          const res = await request(app).put(`/conclude-task/${task.id}/${action}`);
        
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", "Tarefa reaberta com sucesso");
    });

    it("Deve falhar ao reabrir uma tarefa inexistente", async () => {
        const id = 2;

        const action= "reopen";

        const res = await request(app).put(`/conclude-task/${id}/${action}`);
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Tarefa não encontrada");
    });

    it("Deve falhar ao reabrir uma tarefa por erro inesperado", async () => {

        jest.spyOn(Task, "update").mockImplementation(() => {
            throw new Error("Erro inesperado"); 
          });

        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 3,
            done: false,
          });
  
        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

        const action= "reopen";

        const res = await request(app).put(`/conclude-task/${task.id}/${action}`);
        
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error",  "Erro concluir tarefa:");

        Task.update.mockRestore();
    });

});