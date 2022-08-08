import * as jwt from "jsonwebtoken";

const auth0_client_id = Cypress.env("auth0_client_id");
const auth0_client_secret = Cypress.env("auth0_client_secret");
const auth0_audience = Cypress.env("auth0_audience");
const auth0_scope = Cypress.env("auth0_scope");
const auth0_password = Cypress.env("auth0_password");
const plaid_stg_public_key = Cypress.env("plaid_stg_public_key");

const testEmailGen = "tkabilov+test_" + Date.now() + "@steadyapp.com";
const token_bearer = JSON.parse(window.localStorage.getItem("auth0Cypress"));


Cypress.Commands.add("loginAuth0", (auth0_username) => {
  cy.log(`Logging in as ${auth0_username}`);

  if (auth0_username == undefined) {
    auth0_username = Cypress.env("auth0_username");
  }

  cy.request({
    method: "POST",
    url: "https://steady-staging.auth0.com/oauth/token",
    body: {
      grant_type: "password",
      username: auth0_username,
      password: auth0_password,
      audience: auth0_audience,
      scope: auth0_scope,
      client_id: auth0_client_id,
      client_secret: auth0_client_secret,
    },
  }).then(({ body }) => {

    const { payload: claims } = jwt.decode(body.id_token, { complete: true });
    const {
      nickname,
      name,
      picture,
      updated_at,
      email,
      email_verified,
      sub,
      exp,
    } = claims;

    const item = {
      body: {
        ...body,
        decodedToken: {
          claims,
          user: {
            nickname,
            name,
            picture,
            updated_at,
            email,
            email_verified,
            sub,
          },
          auth0_audience,
          auth0_client_id,
        },
      },
      expiresAt: exp,
    };

    window.localStorage.setItem("auth0Cypress", JSON.stringify(item));
    
    cy.log(
      "Bearer token: " +
        JSON.parse(window.localStorage.getItem("auth0Cypress")).body
          .access_token
    );
    //cy.visit("/"); //opens baseUrl specified in cypress.json
  });
});

Cypress.Commands.add("createNLoginAuth0", () => {
  cy.request({
    method: "POST",
    url: "https://steady-staging.auth0.com/dbconnections/signup",

    body: {
      auth0_client_id,
      connection: "Username-Password-Authentication",
      email: testEmailGen,
      password: "Test@123",
      user_metadata: {
        FirstName: "cyTest",
        LastName: "cyTest",
        PhoneNumber: "8182599999",
        Zip: "91504",
      },
    },
  }).then((response) => {
    cy.log(JSON.stringify(response.body));

    expect(response.status).to.eq(200);
    expect(response.body).property("user_id").to.not.be.oneOf([null, ""]);
    expect(response.body).has.property("email", testEmailGen);

    cy.log("IP User Id: " + response.body.user_id);

    cy.wait(1500)

    cy.loginAuth0(testEmailGen);
  });
});

// link and verify BAL
// uses auth0 token from loginAuth0
Cypress.Commands.add("linkPlaid", () => {
  cy.request({
    method: "GET",
    url: "https://steady-income-verification-api-staging.steadyappdev.com/user/GetLinkToken",

    headers: {
      Authorization: "Bearer " + token_bearer.body.access_token
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).property("link_token").to.not.be.oneOf([null, ""]);

    cy.log(response.body.link_token);
  });

  cy.request({
    method: "GET",
    url: "https://steady-income-verification-api-staging.steadyappdev.com/user",

    headers: {
      Authorization: "Bearer " + token_bearer.body.access_token,
    },
  }).then((response) => {
    const ip_user_id = response.body.id;
    cy.log(ip_user_id);

    // Create public token for specified institution_id
    cy.request({
      method: "POST",
      url: "https://sandbox.plaid.com/sandbox/public_token/create",

      body: {
        public_key: plaid_stg_public_key,
        institution_id: "ins_4",
        initial_products: ["transactions"],
      },
    }).then((response) => {
      const plaid_public_token = response.body.public_token;
      cy.log(plaid_public_token);

      // Create plaid link entry in IP
      cy.request({
        method: "POST",
        url: "https://steady-income-verification-api-staging.steadyappdev.com/user/plaidinstitution",

        headers: {
          Authorization: "Bearer " + token_bearer.body.access_token,
        },

        body: {
          userId: ip_user_id,
          institutionId: "ins_4",
          institutionName: "Wells Fargo",
          platformName: "Wells Fargo",
          publicToken: plaid_public_token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        //expect(response.body).property("link_token").to.not.be.oneOf([null, ""]);
        cy.log(JSON.stringify(response.body));

        cy.request({
          method: "POST",
          url: "https://steady-income-verification-api-staging.steadyappdev.com/user/getdata",

          headers: {
            Authorization: "Bearer " + token_bearer.body.access_token,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).property("id").to.not.be.oneOf([null, ""]);

          cy.request({
            method: "GET",
            url: "https://steady-income-verification-api-staging.steadyappdev.com/transaction",

            headers: {
              Authorization: "Bearer " + token_bearer.body.access_token,
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });
    });
  });
});


// get iframe document
Cypress.Commands.add("iframe", { prevSubject: "element" }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function () {
      resolve($iframe.contents().find("body"));
    });
  });
});

