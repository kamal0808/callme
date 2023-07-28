// Requiring module
const assert = require('assert');

// We can group similar tests inside a describe block
describe("Simple Calculations", () => {
    before(() => {
        console.log("This part executes once before all tests");
    });

    after(() => {
        console.log("This part executes once after all tests");
    });

    // We can add nested blocks for different tests
    describe("A function that can send requests of all kinds of protocols", () => {
        beforeEach(() => {
            console.log("executes before every test");
        });

        it("should send a sample GET request");
        it("should send a sample POST request");
        it("should send a sample DELETE request");
        it("should send a sample PATCH request");
        it("should send a sample PUT request");

    
    });

});
