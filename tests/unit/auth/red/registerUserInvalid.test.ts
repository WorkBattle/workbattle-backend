import { test } from "tap";
import server from "../../../../src/app";
import { red } from "chalk";

const testInstance = server.server;

test('try to register with blank username url: "api/v1/auth/register"', async (t) => {
  const app = testInstance;

  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/register",
    payload: {
      email: "some@gmail.com",
      password: "12345678",
    },
  });
  console.log(red("------------------------------------"));
  console.log(red("Response from invalid registration (blank username): "));
  console.log(response.body);
  console.log(red("------------------------------------"));
  t.equal(response.statusCode, 400, "returns a status code of 400");
});

test('try to register with blank password url: "api/v1/auth/register"', async (t) => {
  const app = testInstance;

  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/register",
    payload: {
      username: "someTest",
      email: "some@gmail.com",
    },
  });
  console.log(red("------------------------------------"));
  console.log(red("Response from invalid registration (blank password): "));
  console.log(response.body);
  console.log(red("------------------------------------"));
  t.equal(response.statusCode, 400, "returns a status code of 400");
});
