import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";


Given("Created a new user and logged in", () => {
  cy.createNLoginAuth0();
});

And("On Your details step", () => {
cy.contains("Confirm your details");
});

When("Selecting state and clicking continue", () => {
  cy.get("#state")
  .select("Alabama");

  cy.get("button")
  .contains("CONTINUE")
  .click();

  cy.wait(1000)
});

Then("Landing on Add & confirm your income step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div/header/h2");
});

When("Clicking Add income source", () => {
  cy.get("span[class='content']")
  .contains("Add income source")
  .click();
});

Then("Landing on Add Income Source step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div[2]/header/h4");
});

When("Adding source name", () => {
  cy.get("#source-name")
  .type("TestSource");
  cy.wait(1000);

  cy.get(".btn-add").click();
  cy.wait(1000);
})

Then("Landing on Select the bank accounts... step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div[2]/header/h2/text()[1]");
  cy.wait(1000);
});

When("Click Connect an account", () => {
  cy.get("div.content > button:nth-child(1)").click();
  cy.wait(2000)
})

Then("Plaid webview is launched", () => {
  cy.get("#plaid-link-iframe-1").iframe().should("exist")
})

When("Linking Wells Fargo via Plaid webview", () => {
  cy.wait(2000);
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-button").click()
  cy.wait(2000);
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-ins_4").click()
  cy.wait(2000);
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-input-0").type("user_good")
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-input-1").type("pass_good")
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-button").click()
  cy.wait(2000);
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-button").click();
  cy.wait(3000);
  cy.get("#plaid-link-iframe-1").iframe().find("#aut-button").click();
})

Then("Landing on Select the bank accounts... step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div[2]/header/h2/text()[1]");
  cy.wait(2000);
});

When("Selecting linked Bank and clicking Done", () => {
  cy.get("div[class='row content-container']").click();
  cy.get("button[class='btn-primary']").should("not.be.disabled").click();
});

Then("Landing on Add & confirm your income step", () => {
  cy.xpath("//*[@id='root']/div[1]/main/div/header/h2").should("exist");
});






