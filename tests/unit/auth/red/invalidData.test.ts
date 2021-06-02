import { test } from "tap";
import server from "../../../../src/app";
import { red } from "chalk";

const testInstance = server.server;

test('try to login with invalid username url: "api/v1/auth/login"', async (t) => {
  const app = testInstance;

  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/login",
    payload: {
      username: "invalid_user",
      password: "invalid password",
    },
  });
  console.log(red("------------------------------------"))
  console.log(red("Error from invalid username (DB error): "));
  console.log(response.body);
  console.log(red("------------------------------------"))
  t.equal(response.statusCode, 404, "returns a status code of 404");
});


test('try to login with invalid password and correct username url: "api/v1/auth/login"', async (t) => {
  const app = testInstance;

  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/login",
    payload: {
      username: "test_user",
      password: "invalid-password",
    },
  });
  console.log(red("------------------------------------"))
  console.log(red("Error from invalid password: "));
  console.log(response.body);
  console.log(red("------------------------------------"))
  t.equal(response.statusCode, 401, "returns a status code of 404");
});
