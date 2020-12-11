/// <reference types="cypress" />

describe("Sorting", () => {
    it("successfully loads", () => {
        cy.visit("http://localhost:3000");

        cy.get('a[href="./game"]').click();
    });

    it("can start game", () => {
        cy.visit("http://localhost:3000/game");

        cy.get(".s-btn").click();

        cy.get(".book").should("have.lengthOf", 4);
    });
});
