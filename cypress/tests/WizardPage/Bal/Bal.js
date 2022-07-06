import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

Given("User logged in", () => {
  cy.loginAuth0();
});

When("Making api calls to link nameOfBank", () => {
  cy.linkPlaid();
  
});
