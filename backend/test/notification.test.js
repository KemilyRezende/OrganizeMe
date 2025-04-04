const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../src/models/user");
const List = require("../src/models/list");
const Task = require("../src/models/task");
const Notification = require("../src/models/notification");
const sequelize = require("../src/config/db"); 


describe("Testes criação de notificações", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });

      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
        await List.destroy({where: {}});
        await Notification.destroy({where: {}});
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

    it("Deve criar uma notificação com sucesso", async () => {
        const sender = await User.create({
            name: "User",
            email: "teste@example.com",
            password: "hashPassword",
          });
        const recipient = await User.create({
            name: "User",
            email: "teste2@example.com",
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

        const task = await Task.create({
            idList: list.id,
            name: "Tarefa 1",
            description: "Descrição..",
            deadline: new Date(),
            done: false,
          });

        const type = 5;

        const res = await request(app).post("/create-notification").send({
            type: type,
            idList: list.id,
            idSender: sender.id,
            idRecipient: recipient.id,
            idTask: task.id,
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Notificação enviada com sucesso");
    });

    it("Deve criar uma notificação com sucesso", async () => {

      /*
       * É permitido criar notificações que não se referem a nenhuma tarefa (idTask: null), entretanto
       * ao passar um id a tarefa deve existir no banco de dados.
       */    
      const sender = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });
      const recipient = await User.create({
          name: "User",
          email: "teste2@example.com",
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

      const type = 2;

      const res = await request(app).post("/create-notification").send({
          type: type,
          idList: list.id,
          idSender: sender.id,
          idRecipient: recipient.id,
          idTask: null,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Notificação enviada com sucesso");
    });

    it("Deve falhar ao tentar criar uma notificação com remetente inexistente", async () => {
      const id = 7;
      const recipient = await User.create({
          name: "User",
          email: "teste2@example.com",
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

      const task = await Task.create({
          idList: list.id,
          name: "Tarefa 1",
          description: "Descrição..",
          deadline: new Date(),
          done: false,
        });

      const type = 5;

      const res = await request(app).post("/create-notification").send({
          type: type,
          idList: list.id,
          idSender: id,
          idRecipient: recipient.id,
          idTask: task.id,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "O usuário remetente não foi encontrado");
    });

    it("Deve falhar ao tentar criar uma notificação com lista inexistente", async () => {
      const sender = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });
      const recipient = await User.create({
          name: "User",
          email: "teste2@example.com",
          password: "hashPassword",
        });

        const id = 6;

      const type = 5;

      const res = await request(app).post("/create-notification").send({
          type: type,
          idList: id,
          idSender: sender.id,
          idRecipient: recipient.id,
          idTask: null,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "A lista não foi encontrada");
    });

    it("Deve falhar ao criar uma notificação com destinatario inexistente", async () => {
      const sender = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });
      
      const id = 5;

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

      const type = 5;

      const res = await request(app).post("/create-notification").send({
          type: type,
          idList: list.id,
          idSender: sender.id,
          idRecipient: id,
          idTask: task.id,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "O usuário destinatário não foi encontrado");
    });

    it("Deve falhar ao criar uma notificação por tipo inválido", async () => {
      const sender = await User.create({
        name: "User",
        email: "teste@example.com",
        password: "hashPassword",
      });

      const recipient = await User.create({
          name: "User",
          email: "teste2@example.com",
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

      const task = await Task.create({
        idList: list.id,
        name: "Tarefa 1",
        description: "Descrição..",
        deadline: new Date(),
        done: false,
      });

      const type = 8;

      const res = await request(app).post("/create-notification").send({
        type: type,
        idList: list.id,
        idSender: sender.id,
        idRecipient: recipient.id,
        idTask: task.id,
      });

      expect(res.status).toBe(406);
      expect(res.body).toHaveProperty("error", "Tipo de notificação inválido");

    });

    it("Deve falhar ao criar uma notificação com ID de tarefa inexistente", async () => {
      const sender = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });
      const recipient = await User.create({
          name: "User",
          email: "teste2@example.com",
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

      const id = 8;

      const type = 5;

      const res = await request(app).post("/create-notification").send({
          type: type,
          idList: list.id,
          idSender: sender.id,
          idRecipient: recipient.id,
          idTask: id,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "A tarefa não foi encontrada");
    });

    it("Deve falhar ao criar uma notificação por um erro inesperado", async () => {
      
      jest.spyOn(Notification, "create").mockImplementation(() => {
        throw new Error("Erro inesperado no banco de dados");
      });
      
      const sender = await User.create({
          name: "User",
          email: "teste@example.com",
          password: "hashPassword",
        });
      const recipient = await User.create({
          name: "User",
          email: "teste2@example.com",
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

      const task = await Task.create({
          idList: list.id,
          name: "Tarefa 1",
          description: "Descrição..",
          deadline: new Date(),
          done: false,
        });

      const type = 5;

      const res = await request(app).post("/create-notification").send({
          type: type,
          idList: list.id,
          idSender: sender.id,
          idRecipient: recipient.id,
          idTask: task.id,
      });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Erro ao criar notificação");

      Notification.create.mockRestore();
  });

    it("Deve apagar uma notificação com sucesso", async () => {
      
      const not = await Notification.create({
        type: 1,
        idList: 3,
        idSender: 2,
        idRecipient: 7,
        idTask: 8,
      });

      const res = await request(app).delete(`/delete-notification/${not.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Notificação apagada com sucesso");

    });

    it("Deve apagar uma notificação com sucesso", async () => {
      
      const id = 8;
      const res = await request(app).delete(`/delete-notification/${id}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Notificação não encontrada");

    });

    it("Deve falhar ao apagar uma notificação por erro inesperado", async () => {

      jest.spyOn(Notification, "destroy").mockImplementation(() => {
        throw new Error("Erro inesperado no banco de dados");
      });
      
      const not = await Notification.create({
        type: 1,
        idList: 3,
        idSender: 2,
        idRecipient: 7,
        idTask: 8,
      });

      const res = await request(app).delete(`/delete-notification/${not.id}`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Erro ao apagar Notificação");

      Notification.destroy.mockRestore();

    });

});