import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";


// calling custom command loginAuth0
When('Passport Login', () => {
    cy.loginAuth0();
})

Then('shows onboarding', () => {
    cy.contains('Your details').should('be.equal', 'Verified Income reports made easy - Steady Income Passport')
})