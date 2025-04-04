const request = require("supertest");
const app = require("../app");
const User = require("../src/models/user");
const sequelize = require("../src/config/db"); 

describe("Testes para o Cadastro de Usuário", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
  });

  beforeEach(async () => {
    await User.destroy({ where: {} }); 
  });
  

  afterAll(async () => {
    await sequelize.close();
  });

  it("Deve cadastrar um usuário com sucesso e retornar um token", async () => {
    const res = await request(app).post("/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "12345678",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuário cadastrado com sucesso");
    expect(res.body).toHaveProperty("token");
  });

  it("Deve falhar ao cadastrar um usuário com e-mail já existente", async () => {
    
    await User.create({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "12345678",
    });
    
    const res = await request(app).post("/register").send({
      name: "Usuário Teste 2",
      email: "teste@email.com", // Mesmo email
      password: "outrasenha",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Erro ao cadastrar usuário");
  });

  it("Deve falhar ao cadastrar sem preencher todos os campos obrigatórios", async () => {
    const res = await request(app).post("/register").send({
      email: "incompleto@email.com",
      password: "12345678",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Erro ao cadastrar usuário");
  });

  it("Deve falhar ao cadastrar se houver um erro inesperado", async () => {
    jest.spyOn(User, "create").mockImplementation(() => {
      throw new Error("Erro inesperado no banco de dados");
    });

    const res = await request(app).post("/register").send({
      name: "Usuário Bugado",
      email: "bugado@email.com",
      password: "senha123",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Erro ao cadastrar usuário");

    
    User.create.mockRestore();
  });
});
