const request = require("supertest");
const app = require("../app");
const User = require("../src/models/user");
const sequelize = require("../src/config/db"); 

describe("Testes: Encontrar usuário pelo email", () =>{
    beforeAll(async () => {
        await sequelize.sync({ force: true });
      });
    
    beforeEach(async () => {
        await User.destroy({ where: {} }); 
      });
        
    afterAll(async () => {
        await sequelize.close();
      });

    it("Deve encontrar o usuário e retornar um token", async () => {

      await User.create({
        name: "User",
        email: "teste@example.com",
        password: "123456",
      });

      const res = await request(app).get("/get-user-by-email/teste@example.com");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Usuário encontrado");
      expect(res.body).toHaveProperty("user"); 
      expect(res.body.user).toHaveProperty("email", "teste@example.com");
    });

    it("Deve falhar ao fornecer um email não cadastrado", async () => {
      const res = await request(app).get("/get-user-by-email/teste@example.com");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Nenhum usuário encontrado com este email.");
    });

   it("Deve falhar devido a erro inesperado", async () => {
      jest.spyOn(User, "findOne").mockImplementation(() => {
        throw new Error("Erro inesperado"); 
      });
    
      const res = await request(app).get("/get-user-by-email/teste@example.com");
    
      expect(res.status).toBe(500); 
      expect(res.body).toHaveProperty("error", "Erro ao buscar o usuário"); 
      expect(res.body).toHaveProperty("detalhes", "Erro inesperado"); 
    
   });
});