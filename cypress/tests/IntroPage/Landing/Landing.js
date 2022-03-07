import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

Given('Im in logged out state', () => {
    cy.visit('/');
    cy.get('button').contains('LOG IN')
});

And('on passport intro page', () => {
    cy.visit('/');
})

Given('Language cta is present', () => {
    cy.get('button').contains('Language')
});

When('I click Get Started', () => {
    cy.get('[class="btn-primary"]').click()
});

Then('I see login sign up form', () => {
    cy.get('[class="auth0-lock-content"]').should('be.visible')
});

Given('Terms link present and clickable', () => {
    cy.xpath('//*[@id="root"]/div[1]/footer/small/a').should('be.visible')

});

When('I click Terms link', () => {
    cy.xpath('//*[@id="root"]/div[1]/footer/small/a').invoke('removeAttr', 'target').click()

});

Then('I should land on Terms and condition page', () => {

    cy.title().should('eq', 'Terms of Service')
});


