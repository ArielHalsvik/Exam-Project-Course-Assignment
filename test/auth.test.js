var express = require("express");
var app = express();
var request = require("supertest");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");

var authRouter = require("../routes/auth");
app.use(bodyParser.json());
app.use("/auth", authRouter);

function testJWT() {
  return jwt.sign({ roleId: 1 }, process.env.TOKEN_SECRET, {
    expiresIn: "2h",
  });
}

describe("testing auth routes", () => {
  let token = testJWT();
  let userId;

  /* Create a User for Testing */
  test("POST /auth/register - success", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      userName: "johndoe",
      email: "johndoe@gmail.com",
      password: "P@ssword123",
      address: "Home Street 123",
      telephoneNumber: "12345678",
    };

    const { body } = await request(app).post("/auth/register").send(newUser);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("User registered successfully.");
  });

  /* Login with Valid User */
  test("POST /auth/login - success", async () => {
    const user = {
      userName: "johndoe",
      password: "P@ssword123",
    };

    const { body } = await request(app).post("/auth/login").send(user);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data).toHaveProperty("token");
    expect(body.data.result).toBe("User logged in successfully.");
    userId = body.data.userId;
  });

  /* Login with Invalid User */
  test("POST /auth/login - failed", async () => {
    const user = {
      userName: "lisadoe",
      password: "P@ssword1234",
    };

    const { body } = await request(app).post("/auth/login").send(user);

    expect(body.statusCode).toBe(500);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("User not found.");
  });

  /* Delete Test User */
  test("DELETE /auth/:userId - success", async () => {
    const { body } = await request(app)
      .delete(`/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(body.statusCode).toBe(200);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("User deleted successfully.");
  });
});
