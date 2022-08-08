import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const plaid_stg_public_key = Cypress.env("plaid_stg_public_key");
const plaid_stg_client_id = Cypress.env("plaid_stg_client_id");
const plaid_stg_secret = Cypress.env("plaid_stg_secret");

const todaysDate = new Date().toISOString().slice(0, 10);

function getAuth0Token() {
  let auth0Item = JSON.parse(window.localStorage.getItem("auth0Cypress"));
  let auth0AccessToken = auth0Item.body.access_token;

  return auth0AccessToken;
}

 //func to keep polling /transaction endpoint until data is returned
      function transactionRequest() {
        let attempts = 0;

        cy.request({
          method: "GET",
          url: "https://steady-income-verification-api-staging.steadyappdev.com/transaction",

          headers: {
            Authorization: "Bearer " + getAuth0Token(),
          },
        }).then((response) => {
          // verify if data is returned and within max attempts
          if (attempts > 50) {
            expect(attempts).to.be.lessThan(50);
            return cy.log("Exceeded polling attempts");
          } else if (response.body[0] !== undefined) return;
          else {
            attempts++;
            // recursively call func after 2 secs
            setTimeout(function () {
              return transactionRequest();
            }, 2000);
          }
        });
      }


Given("Created and authorized a new user via auth0", () => {
  cy.createNLoginAuth0();

  // listen to first post user call
  cy.intercept({
    method: "POST",
    url: "/user"
  }).as("firstUserPost");

  cy.visit("/");
  cy.wait("@firstUserPost");
});


/* Revisit this after sorting out how to get steadyId from auth0 /userinfo or app metadata{}
 for now I'm using cy.visit("/") to hit base url and have FE make the first /user post call
 */

/*And("Make a post call to IP user endpoint", () => {

cy.request({
  method: "POST",
  url: "https://steady-income-verification-api-staging.steadyappdev.com/user",
  body: {
     }
})
})
*/

And("Selected state and passed referrerId", () => {
  cy.request({
    method: "GET",
    url: "https://steady-income-verification-api-staging.steadyappdev.com/user",

    headers: {
      Authorization: "Bearer " + getAuth0Token(),
    },
  }).then((response) => {
    let userEmail = response.body.email;

    cy.request({
      method: "PUT",
      url: "https://steady-income-verification-api-staging.steadyappdev.com/user",
      headers: {
        Authorization: "Bearer " + getAuth0Token(),
      },

      body: {
        firstName: "cyTestFirst",
        lastName: "cyTestLast",
        email: userEmail,
        state: "Louisiana",
        lastClaimDate: todaysDate,
        languageCode: "en-US",
        reportType: null,
        reportStartPeriod: null,
        reportEndPeriod: null,

        userJourneyInfo: {
          journeyType: 1,
          referrerId: "61d4c74e08425ae54a7afb5f",
        },
      },
    });
  });
});


And("Created transaction source group", () => {
  cy.request({
    method: "POST",
    url: "https://steady-income-verification-api-staging.steadyappdev.com/transactiongroups",
    headers: {
      Authorization: "Bearer " + getAuth0Token(),
    },

    body: {
      name: "testSource",
      institutionsPlaid: [],
    },
  });
});


When("I call IP api to get link_token", () => {
  // verify getLinkToken via IP api
  cy.request({
    method: "GET",
    url: "https://steady-income-verification-api-staging.steadyappdev.com/user/GetLinkToken",

    headers: {
      Authorization: "Bearer " + getAuth0Token(),
    },
  }).as("GetLinkToken");
});

Then("I should get successful reponse containing a link_token", () => {
  cy.get("@GetLinkToken").then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).property("link_token").to.not.be.oneOf([null, ""]);
    expect(response).property("duration").to.be.lt(2000);
    cy.log(response.body.link_token);
  });
});


When("I get IP user ID", () => {
  cy.request({
    method: "GET",
    url: "https://steady-income-verification-api-staging.steadyappdev.com/user",

    headers: {
      Authorization: "Bearer " + getAuth0Token(),
    },
  }).as("ipUserData");
});


And("Create plaid public_token for WF bank", () => {
  cy.request({
    method: "POST",
    url: "https://sandbox.plaid.com/sandbox/public_token/create",

    body: {
      public_key: plaid_stg_public_key,
      institution_id: "ins_4",
      initial_products: ["transactions"],
      options: {
        webhook: "https://api.steadyappdev.com/api/v2/webhooks/plaid",
      },
    },
  }).as("PlaidPublicToken");
});


Then("Should get public_token and user Id", () => {
  cy.get("@ipUserData").then((response) => {
    cy.log(JSON.stringify(response.body));
    expect(response.status).to.eq(200);
    expect(response.body).property("id").to.not.be.oneOf([null, ""]);
  });

  cy.get("@PlaidPublicToken").then((response) => {
    cy.log(JSON.stringify(response.body));
    expect(response.status).to.equal(200);
    expect(response.body).property("public_token").to.not.be.oneOf([null, ""]);
  });
});


When("I exchange Plaid's public_token for the access_token", () => {
  cy.get("@PlaidPublicToken").then((response) => {
    let plaid_public_token = response.body.public_token;

    cy.request({
      method: "POST",
      url: "https://sandbox.plaid.com/item/public_token/exchange",
      body: {
        client_id: plaid_stg_client_id,
        secret: plaid_stg_secret,
        public_token: plaid_public_token,
      },
    }).as("plaidAccessToken");
  });
});


Then("I should get access_token and item_id", () => {
  cy.get("@plaidAccessToken").then((response) => {
    cy.log(JSON.stringify(response.body));
    expect(response.status).to.equal(200);
    expect(response.body).property("access_token").to.not.be.oneOf([null, ""]);
    expect(response.body).property("item_id").to.not.be.oneOf([null, ""]);
  });
});


When("Create plaid item entry via user plaidinstitution endpoint", () => {
  cy.get("@ipUserData").then((response) => {
    let ip_user_id = response.body.id;
    cy.log(ip_user_id);

    // using public_token instead of access_token since /plaidinstitution handles token exchange
    cy.get("@plaidAccessToken").then((response) => {
      let plaid_access_token = response.body.access_token;
      cy.log(plaid_access_token);

      cy.get("@PlaidPublicToken").then((response) => {
        let plaid_public_token = response.body.public_token;

        cy.request({
          method: "POST",
          url: "https://steady-income-verification-api-staging.steadyappdev.com/user/plaidinstitution",

          headers: {
            Authorization: "Bearer " + getAuth0Token(),
          },

          body: {
            userId: ip_user_id,
            institutionId: "ins_4",
            institutionName: "Wells Fargo",
            platformName: "Wells Fargo",
            publicToken: plaid_public_token,
          },
        }).as("user/plaidinstitution");
      });
    });
  })
})


Then("I should get successful response from plaidinstituion endpoint", () => {
    cy.get("@user/plaidinstitution").then((response) => {
      expect(response.status)
      .to.equal(200);
      expect(response.body)
        .property("plaidConnection")
        .to.not.be.oneOf([null, ""]);
      expect(response.body)
      .property("steadyId")
      .to.not.be.oneOf([null, ""]);
      expect(response.body)
      .property("id")
      .to.not.be.oneOf([], "");
      cy.log(JSON.stringify(response.body));
    });
  }
);


When("Calling transaction endpoint", () => {

 cy.request({
   method: "GET",
   url: "https://steady-income-verification-api-staging.steadyappdev.com/transaction",

   headers: {
     Authorization: "Bearer " + getAuth0Token(),
   },
 }).as("transaction");})


  Then(
    "I should get transaction data returned after AllHistoricalPull is complete", () => {
      
      // func to keep polling /transaction until data is returned
      transactionRequest();
     
      cy.get("@transaction").then((response) => {
        cy.log(response.body[0]);
        expect(response.body.status).to.be.equal(200);
        expect(response.body[0]).property("id").to.not.be.oneOf(["", null])
        expect(response.body[0]).property("institutionId").to.not.be.oneOf(["", null])
        expect(response.body[0]).property("userId").to.not.be.oneOf(["", null]);
        
      })
    })


  And("Plaid fullySynced prop should be true", () => {
    cy.request({
      method: "GET",
      url: "https://steady-income-verification-api-staging.steadyappdev.com/user",

      headers: {
        Authorization: "Bearer " + getAuth0Token(),
      },
    }).then((response) => {
      cy.log(response.body.plaidConnection);
      expect(response.status).to.eq(200);
      expect(response.body.plaidConnection).property("fullySynced").to.be(True);
    });
  });
 
