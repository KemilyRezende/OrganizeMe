const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../src/models/user");
const List = require("../src/models/list");
const Relation = require("../src/models/relation");
const sequelize = require("../src/config/db"); 

describe("Testes relações", () =>{

    beforeAll(async () => {
        await sequelize.sync({ force: true });
      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
        await List.destroy({where: {}});
        await Relation.destroy({where: {}});
      });
        
    afterAll(async () => {
        await sequelize.close();
      });


      it("Deve criar uma relação entre usuário e lista com sucessso", async () =>{
        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
        });

        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
        });

        const res = await request(app).post("/relate-user-list").send({
            idList: list.id,
            idUser: user.id,
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Relação criada com sucesso");
        
      });

      it("Deve falhar ao tentar criar uma relação com um usuário inexistente", async () => {
        const id = 7;
        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
        });

        const res = await request(app).post("/relate-user-list").send({
            idList: list.id,
            idUser: id,
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Usuário não encontrado");
      });

      it("Deve falhar ao tentar criar uma relação com uma lista inexistente", async () => {
        const id = 7;
        
        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
        });

        const res = await request(app).post("/relate-user-list").send({
            idList: id,
            idUser: user.id,
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Lista não encontrada");
      });

      it("Deve falhar ao criar uma relação entre usuário e lista por um erro inesperado", async () =>{

        jest.spyOn(Relation, "create").mockImplementation(() => {
                  throw new Error("Erro inesperado"); 
                });

        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
        });

        const list = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
        });

        const res = await request(app).post("/relate-user-list").send({
            idList: list.id,
            idUser: user.id,
        });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao criar relação");

        Relation.create.mockRestore();
        
      });

      it("Deve apagar uma relação com sucesso", async () => {
        const user = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const rel = await Relation.create({
          idList: list.id,
          idUser: user.id,
        });

        const res = await request(app).delete(`/delete-relation/${list.id}/${user.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Relação apagada com sucesso");
        
      });

      it("Deve falhar ao tentar apagar uma relação inexistente", async () => {
        
        const idU = 1;
        const idL = 2;
        const res = await request(app).delete(`/delete-relation/${idL}/${idU}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Relação não encontrada");
        
      });

      it("Deve falhar ao tentar apagar uma relação por um erro inesperado", async () => {

        jest.spyOn(Relation, "destroy").mockImplementation(() => {
          throw new Error("Erro inesperado"); 
        });

        const user = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });

        const list = await List.create({
          name: "Lista 1",
          description: "lista de teste",
          deadline: new Date(),
          tasks: 5,
          pendencies: 0,
          done: false,
        });

        const rel = await Relation.create({
          idList: list.id,
          idUser: user.id,
        });

        const res = await request(app).delete(`/delete-relation/${list.id}/${user.id}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao apagar a relação");

        Relation.destroy.mockRestore();
        
      });
});