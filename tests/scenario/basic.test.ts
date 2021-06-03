import { test } from "tap";
import server from "../../src/app";
import { green } from "chalk";
import userService from "../../src/userManagment/utils/userService";
import contestService from "../../src/contestManagment/utils/contestService";
import postgresQueryExecutor from "../../src/db/postgresQueryExecutor";
import submissionService from "../../src/submissionManagment/utils/submissionService";

const testInstance = server.server;
let token = "";
let contestUuid = "";
let userUuid = "";
let submissionUuid = "";
const app = testInstance;
test("Running scenario test with phases: register -> getUserInfo -> create contest -> update contest -> create submission -> update submission", async (t) => {
  const responseRegister = await app.inject({
    method: "POST",
    url: "/api/v1/auth/register",
    payload: {
      username: "newUser",
      email: "some@gmail.com",
      password: "12345678",
    },
  });
  console.log(green("------------------------------------"));
  console.log(green("Response from registration: "));
  console.log(responseRegister.body);
  console.log(green("------------------------------------"));
  t.equal(responseRegister.statusCode, 201, "returns a status code of 201");
  token = await JSON.parse(responseRegister.body).token;
})
  .then((result: any) => {
    test("Get User Info", async (t) => {
      const responseGetInfo = await app.inject({
        method: "GET",
        url: "/api/v1/user/getInfo",
        headers: {
            authorization: `Basic ${token}`,
          },
      });
      console.log(green("------------------------------------"));
      console.log(green("Response from getInfo: "));
      console.log(responseGetInfo.body);
      console.log(green("------------------------------------"));
      t.equal(responseGetInfo.statusCode, 200, "returns a status code of 200");

      userUuid = JSON.parse(responseGetInfo.body).user.uuid;
    });
  })
  .then((res: any) => {
    test("Create Contest", async (t) => {
      const responseCreateContest = await app.inject({
        method: "POST",
        url: "/api/v1/contest",
        payload: {
          title: "Scenario Test",
          description: "Scenarion Desc",
          taskDescription: "Scenario desc",
          closed: false,
          authorUuid: userUuid,
          contestUuid: "7a8b673c-8a94-4e27-aa8c-235caf2c5f06",
          contestStart: "2021-05-25",
          contestStop: "2021-05-28",
          contestType: "file",
        },
        headers: {
          authorization: `Basic ${token}`,
        },
      });
      console.log(green("------------------------------------"));
      console.log(green("Response from createContest: "));
      console.log(responseCreateContest.body);
      console.log(green("------------------------------------"));
      t.equal(
        responseCreateContest.statusCode,
        201,
        "returns a status code of 201"
      );

      const getContest: any = await postgresQueryExecutor(
        "SELECT * FROM contest WHERE author_uuid = $1",
        [userUuid]
      );
      contestUuid = getContest.rows[0].uuid;
    });
  })
  .then((res: any) => {
    test("Update Contest", async (t) => {
      const responseUpdateContest = await app.inject({
        method: "PATCH",
        url: "/api/v1/contest",
        payload: {
          uuid: contestUuid,
          title: "Scenario Test",
          description: "Scenarion Desc",
          taskDescription: "Scenario desc",
          closed: false,
          authorUuid: userUuid,
          contestStart: "2021-05-25",
          contestStop: "2021-05-28",
          contestType: "file",
        },
        headers: {
          authorization: `Basic ${token}`,
        },
      });
      console.log(green("------------------------------------"));
      console.log(green("Response from updateContest: "));
      console.log(responseUpdateContest.body);
      console.log(green("------------------------------------"));
      t.equal(
        responseUpdateContest.statusCode,
        200,
        "returns a status code of 200"
      );
    });
  })
  .then((res: any) => {
    test("Create Submission", async (t) => {
      const responseCreateSubmission = await app.inject({
        method: "POST",
        url: "/api/v1/submission",
        payload: {
          contentType: "url",
          userUuid: "8591f2c7-b423-4535-9fe1-fe50dfcaf47a",
          contestUuid: contestUuid,
        },
        headers: {
          authorization: `Basic ${token}`,
        },
      });
      console.log(green("------------------------------------"));
      console.log(green("Response from createSubmission: "));
      console.log(responseCreateSubmission.body);
      console.log(green("------------------------------------"));
      t.equal(
        responseCreateSubmission.statusCode,
        201,
        "returns a status code of 201"
      );

      const getSubmission: any = await postgresQueryExecutor(
        "SELECT * FROM submission WHERE user_uuid = $1",
        ["8591f2c7-b423-4535-9fe1-fe50dfcaf47a"]
      );
      submissionUuid = getSubmission.rows[0].uuid;
    });
  })
  .then((res: any) => {
    test("Update Submission", async (t) => {
      const responseUpdateSubmission = await app.inject({
        method: "PATCH",
        url: "/api/v1/submission",
        payload: {
          uuid: submissionUuid,
          contentType: "file",
          userUuid: "8591f2c7-b423-4535-9fe1-fe50dfcaf47a",
          contestUuid: contestUuid,
        },
        headers: {
          authorization: `Basic ${token}`,
        },
      });
      console.log(green("------------------------------------"));
      console.log(green("Response from createSubmission: "));
      console.log(responseUpdateSubmission.body);
      console.log(green("------------------------------------"));
      t.equal(
        responseUpdateSubmission.statusCode,
        200,
        "returns a status code of 200"
      );

      await submissionService.deleteRecord(submissionUuid);
      await contestService.deleteRecord(contestUuid);
      await userService.deleteRecord("", "newUser");
    });
  });

// 7a8b673c-8a94-4e27-aa8c-235caf2c5f06
