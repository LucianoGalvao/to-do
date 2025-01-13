const request = require("supertest");
const { app } = require("../server");

let token;

beforeAll(async () => {
  const loginData = {
    email: process.env.ADMIN_EMAIL_MOCK,
    password: process.env.ADMIN_SECRET_MOCK,
  };

  const loginRequest = await request(app)
    .post("/api/auth/login")
    .send(loginData);

  expect(loginRequest.status).toBe(200);
  token = loginRequest.body.token;
});

describe("Tasks controller", () => {
  it("Deve listar todas as tasks, sem filtro, sem paginação", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it("Deve listar as tasks que contenham a palavra 'pão' no título", async () => {
    const res = await request(app)
      .get("/api/tasks?title=pão")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });
});
