import * as jwt from "jsonwebtoken";

Cypress.Commands.add("loginAuth0", () => {
  const client_id = Cypress.env("auth0_client_id");
  const client_secret = Cypress.env("auth0_client_secret");
  const audience = Cypress.env("auth0_audience");
  const scope = Cypress.env("auth0_scope");
  const username = Cypress.env("auth0_username");
  const password = Cypress.env("auth0_password");
  const url = Cypress.env("auth0_domain");

  cy.log(`Logging in as ${username}`);

  cy.request({
    method: "POST",
    url,
    body: {
      grant_type: "password",
      username,
      password,
      audience,
      scope,
      client_id,
      client_secret,
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
          audience,
          client_id,
        },
      },
      expiresAt: exp,
    };

    window.localStorage.setItem("auth0Cypress", JSON.stringify(item));
    cy.visit("/"); //opens baseUrl specified in cypress.json
  });
});
