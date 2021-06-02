import { test } from "tap";
import server from "../../../../src/app";
import { green } from "chalk";

const testInstance = server.server;

test('try to login with valid username and password url: "api/v1/auth/login"', async (t) => {
  const app = testInstance;

  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/login",
    payload: {
      username: "test_user",
      password: "12345678",
    },
  });
  console.log(green("------------------------------------"))
  console.log(green("Response from authentication with username: "));
  console.log(response.body);
  console.log(green("------------------------------------"))
  t.equal(response.statusCode, 200, "returns a status code of 200");
});

test('try to login with valid email and password url: "api/v1/auth/login"', async (t) => {
    const app = testInstance;
  
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: "test@gmail.com",
        password: "12345678",
      },
    });
    console.log(green("------------------------------------"))
    console.log(green("Response from authentication with email: "));
    console.log(response.body);
    console.log(green("------------------------------------"))
    t.equal(response.statusCode, 200, "returns a status code of 200");
  });