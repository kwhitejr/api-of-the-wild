"use strict";

const app = require("../../../../src/lambdas/hello_world/index");
const { expect } = require("chai");
var event, context;

describe("hello_world.js", function() {
  describe("lambda_handler()", () => {
    it("verifies successful response", async () => {
      await app.lambda_handler(event, context, (err, result) => {
        expect(result).to.be.an("object");
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an("string");

        let response = JSON.parse(result.body);

        expect(response).to.be.an("object");
        expect(response.message).to.be.equal("hello world");
        expect(response.location).to.be.an("string");
      });
    });
  });
});
