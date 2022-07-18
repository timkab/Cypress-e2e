import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

Given("Created a new user and logged in", () => {
  cy.createNLoginAuth0();
});

And("On Your details step", () => {
  cy.contains("Confirm your details");
});

When("Selecting state and clicking continue", () => {
  cy.get("#state").select("Alabama");

  cy.get("button").contains("CONTINUE").click();

  cy.wait(1000);
});

Then("Landing on Add & confirm your income step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div/header/h2");
});

When("Clicking Add income source", () => {
  cy.get("span[class='content']").contains("Add income source").click();
});

Then("Landing on Add Income Source step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div[2]/header/h4");
});

When("Typing Uber and clicking connect Uber account", () => {
  cy.get("#source-name").type("Uber");
  cy.wait(1000);
  cy.get("button[class='btn-custom btn-connect btn-item']").click();
  cy.wait(2000);
});

Then("Argyle is launched", () => {
  cy.get("div[data-hook='argyle-link-content']").should("exist");

});

When("Linking Uber via Argyle", () => {
    cy.get("div[data-type='picker-button']").click();
    cy.wait(1000);
    cy.contains("Email and Password").click();
    cy.wait(1000);
    cy.get("input[name='username']").type("test1@argyle.com");
    cy.get("input[name='password']").type("passgood");
    cy.get("button[data-hook='connect-button']").click();
    cy.wait(3000)
    cy.get("input[data-hook='mfa-code-input']").type("8081");
    cy.get("button[data-hook='connect-button']").click();
    cy.wait(3000);
    cy.get("button[data-hook='success-close']").click();
})

Then("Landing on Add & confirm your income step", () => {
cy.xpath("//*[@id='root']/div[1]/main/div/header/h2").should("exist");
})

;