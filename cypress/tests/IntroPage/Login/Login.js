import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";


// calling custom command loginAuth0
When('Passport Login', () => {
    cy.loginAuth0();
})