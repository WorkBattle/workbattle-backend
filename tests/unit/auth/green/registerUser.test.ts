import { test } from "tap";
import server from "../../../../src/app";
import { green } from "chalk";
import userService from "../../../../src/userManagment/utils/userService";

const testInstance = server.server;

test('try to register with valid params url: "api/v1/auth/register"', async (t) => {
  const app = testInstance;

  const response = await app.inject({
    method: "POST",
    url: "/api/v1/auth/register",
    payload: {
      username: "newUserRegister",
      email: "some@gmail.com",
      password: "12345678",
    },
  });
  await userService.deleteRecord("", "newUserRegister");
  console.log(green("------------------------------------"));
  console.log(green("Response from registration: "));
  console.log(response.body);
  console.log(green("------------------------------------"));
  t.equal(response.statusCode, 201, "returns a status code of 201");
});