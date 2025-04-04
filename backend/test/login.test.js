const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../src/models/user");
const sequelize = require("../src/config/db"); 

describe("Testes de Login.", () => {

    beforeAll(async () => {
        await sequelize.sync({ force: true });
      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

    it("Deve realizar o login com sucesso e retornar um token", async () => {
        const hashPassword = await bcrypt.hash("senha123", 10);
        await User.create({
            name: "User",
            email: "teste@example.com",
            password: hashPassword,
        });

        const res = await request(app).post("/login").send({
            email: "teste@example.com",
            password: "senha123",
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Login bem-sucedido");
        expect(res.body).toHaveProperty("token");  
    });

    it("Deve falhar por enviar o email errado", async () => {
        const hashPassword = await bcrypt.hash("123456", 10);
        await User.create({
            name: "User",
            email: "teste@example.com",
            password: hashPassword,
        });

        const res = await request(app).post("/login").send({
            email: "teste_com_erro@email.com",
            password: "123456",
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Credenciais inválidas!");
    });

    it("Deve falhar por enviar a senha errada", async () => {
        const hashPassword = await bcrypt.hash("123456", 10);
        await User.create({
            name: "User",
            email: "teste@example.com",
            password: hashPassword,
        });

        const res = await request(app).post("/login").send({
            email: "teste@example.com",
            password: "senha_errada",
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error", "Credenciais inválidas!");
    });

    it("Deve falhar devido a um erro inesperado", async () =>{
        const hashPassword = await bcrypt.hash("123456", 10);
        await User.create({
            name: "User",
            email: "teste@example.com",
            password: hashPassword,
        });

        jest.spyOn(User, "findOne").mockImplementation(() => {
            throw new Error("Erro inesperado"); 
          });

        const res = await request(app).post("/login").send({
            email: "teste@example.com",
            password: "senha123",
        });
    });
});