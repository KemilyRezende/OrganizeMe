const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../src/models/user");
const List = require("../src/models/list");
const Relation = require("../src/models/relation");
const Notification = require("../src/models/notification");
const sequelize = require("../src/config/db"); 

describe("Testes da página do usuário (Listas e Notificações)", () =>{

    beforeAll(async () => {
        await sequelize.sync({ force: true });
      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
        await List.destroy({where: {}});
        await Relation.destroy({where: {}});
        await Notification.destroy({where: {}});
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

      it("Deve encontrar as Listas do usuário com sucesso", async () => {

        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });
  
          const list1 = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });

          const list2 = await List.create({
            name: "Lista 2",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });
  
          const rel = await Relation.create({
            idList: list1.id,
            idUser: user.id,
          });

          const rel2 = await Relation.create({
            idList: list2.id,
            idUser: user.id,
          });

          const res = await request(app).get(`/user-lists/${user.id}`);

          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", "Listas encontradas");
          expect(res.body).toHaveProperty("lists");
      });

      it("Usuário sem listas", async () => {

        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });

          const res = await request(app).get(`/user-lists/${user.id}`);

          expect(res.status).toBe(204);
        });

      it("Deve falhar ao buscar listas com ID inválido", async () => {

        const id = 9;

        const res = await request(app).get(`/user-lists/${id}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "ID inválido.");
      });

      it("Deve falhar ao encontrar as Listas do usuário por um erro inesperado", async () => {
        
        jest.spyOn(Relation, "findAll").mockImplementation(() => {
            throw new Error("Erro inesperado"); 
          });

        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });
  
          const list1 = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });

          const list2 = await List.create({
            name: "Lista 2",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });
  
          const rel = await Relation.create({
            idList: list1.id,
            idUser: user.id,
          });

          const rel2 = await Relation.create({
            idList: list2.id,
            idUser: user.id,
          });

          const res = await request(app).get(`/user-lists/${user.id}`);

          expect(res.status).toBe(500);
          expect(res.body).toHaveProperty("error", "Erro ao buscar as listas do usuário");

          Relation.findAll.mockRestore();
      });

      it("Deve encontrar as notificações do usuário com sucesso", async () => {
        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });

          const list1 = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });

        const not = await Notification.create({
            type: 1,
            idList: list1.id,
            idSender: 2,
            idRecipient: user.id,
            idTask: null,
        });

        const not2 = await Notification.create({
            type: 4,
            idList: list1.id,
            idSender: 2,
            idRecipient: user.id,
            idTask: null,
        });

        const res = await request(app).get(`/user-notifications/${user.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Notificações encontradas");
        expect(res.body).toHaveProperty("notifications");

      });

      it("Deve falhar ao buscar notificações com ID inválido:", async () => {
        const id = 9;


        const res = await request(app).get(`/user-notifications/${id}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "ID inválido.");
      });

      it("Usuário sem notificações", async () => {
        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });

        const res = await request(app).get(`/user-notifications/${user.id}`);

        expect(res.status).toBe(204);
      });

      it("Deve falhar ao tentar encontrar as notificações do usuário por um error inesperado", async () => {
        jest.spyOn(Notification, "findAll").mockImplementation(() => {
            throw new Error("Erro inesperado"); 
          });
        
        const user = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });

          const list1 = await List.create({
            name: "Lista 1",
            description: "lista de teste",
            deadline: new Date(),
            tasks: 5,
            pendencies: 0,
            done: false,
          });

        const not = await Notification.create({
            type: 1,
            idList: list1.id,
            idSender: 2,
            idRecipient: user.id,
            idTask: null,
        });

        const not2 = await Notification.create({
            type: 4,
            idList: list1.id,
            idSender: 2,
            idRecipient: user.id,
            idTask: null,
        });

        const res = await request(app).get(`/user-notifications/${user.id}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Erro ao buscar as notificações do usuário");

        Notification.findAll.mockRestore();
      });

});