const request = require("supertest");
const app = require("../app");
const User = require("../src/models/user");
const Task = require("../src/models/task");
const List = require("../src/models/list");
const sequelize = require("../src/config/db"); 

describe("Testes: Encontrar usuário, tarefa e lista pelo ID", () =>{
    beforeAll(async () => {
        await sequelize.sync({ force: true });
      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
        await Task.destroy({where: {}});
        await List.destroy({where: {}});
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

    /* Testes para encontrar usuário:*/
    it("Deve encontrar o usuário e retornar", async () => {

        const user = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "123456",
        });
  
        const res = await request(app).get(`/get-user-by-id/${user.id}`);
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Usuário encontrado");
        expect(res.body).toHaveProperty("user"); 
      });

    it("Deve falhar ao fornecer um ID de usuário não cadastrado", async () => {
        const id = 9;
        const res = await request(app).get(`/get-user-by-id/${id}`);
  
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Nenhum usuário encontrado com este ID.");
    });

    it("Deve falhar devido a erro inesperado", async () => {
        jest.spyOn(User, "findByPk").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });
      
        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "123456",
          });
    
        const res = await request(app).get(`/get-user-by-id/${user.id}`);
      
        expect(res.status).toBe(500); 
        expect(res.body).toHaveProperty("error", "Erro ao buscar o usuário"); 
        expect(res.body).toHaveProperty("detalhes", "Erro inesperado"); 

        User.findByPk.mockRestore();
      
     });

    /* Testes para encontrar Lista:*/

    it("Deve encontrar a lista e retornar", async () => {

        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });
  
        const res = await request(app).get(`/get-list-by-id/${list.id}`);
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Lista encontrada");
        expect(res.body).toHaveProperty("list"); 
      });

    it("Deve falhar buscar ID de lista inexistente", async () => {
        const id = 9;
        const res = await request(app).get(`/get-list-by-id/${id}`);
  
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Nenhuma lista encontrada com este ID.");
    });

    it("Deve falhar devido a erro inesperado", async () => {
        jest.spyOn(List, "findByPk").mockImplementation(() => {
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
  
        const res = await request(app).get(`/get-list-by-id/${list.id}`);
      
        expect(res.status).toBe(500); 
        expect(res.body).toHaveProperty("error", "Erro ao buscar Lista"); 
        expect(res.body).toHaveProperty("detalhes", "Erro inesperado"); 

        List.findByPk.mockRestore();
      
     });

    /* Testes para encontrar Tarefa:*/

    it("Deve encontrar a lista e retornar", async () => {

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
  
        const res = await request(app).get(`/get-task-by-id/${task.id}`);
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Tarefa encontrada");
        expect(res.body).toHaveProperty("task"); 
      });

    it("Deve falhar buscar ID de tarefa inexistente", async () => {
        const id = 9;
        const res = await request(app).get(`/get-task-by-id/${id}`);
  
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Nenhuma tarefa encontrada com este ID.");
    });

    it("Deve falhar devido a erro inesperado", async () => {
        jest.spyOn(Task, "findByPk").mockImplementation(() => {
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
  
        const res = await request(app).get(`/get-task-by-id/${task.id}`);
      
        expect(res.status).toBe(500); 
        expect(res.body).toHaveProperty("error", "Erro ao buscar tarefa"); 
        expect(res.body).toHaveProperty("detalhes", "Erro inesperado"); 
      
        Task.findByPk.mockRestore();
     });
});