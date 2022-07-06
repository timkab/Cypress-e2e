import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

When("Making auth0 call to create a new user", () => {
  cy.createNLoginAuth0();
});
