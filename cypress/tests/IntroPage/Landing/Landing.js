import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const url = 'https://passport.steadyapp.com'

Given('I in logged out state', () => {
    cy.visit(url);
    cy.get('button').contains('LOG IN')
});

And('on passport intro page', () => {
    cy.visit(url, {
        onBeforeLoad(win) {
            cy.stub(win, 'open')
        }
    })
})

Given('Get Started cta is present and clickable', () => {
    cy.get('[class="btn-primary"]').should('be.visible')
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
    cy.xpath('//*[@id="root"]/div[1]/footer/small/a').click
    cy.window().its('open').should('be.called')
    cy.visit('https://steadyapp.com/terms-of-service')
});

Then('I should land on Terms and condition page', () => {

    cy.title().should('eq', 'Terms of Service')
});


