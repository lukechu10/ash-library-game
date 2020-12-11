/// <reference types="cypress" />

describe("Sorting", () => {
    it("successfully loads", () => {
        cy.visit("http://localhost:3000");

        cy.get("a").click();
    });
});
