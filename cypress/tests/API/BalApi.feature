Feature: Create source, BAL and get deposits

    Scenario: Link bank account and verify deposit data is returned
        Given Created and authorized a new user via auth0
        And Selected state and passed referrerId
        And Created transaction source group
        When I call IP api to get link_token
        Then I should get successful reponse containing a link_token
        When I get IP user ID
        And Create plaid public_token for WF bank
        Then Should get public_token and user Id
        When I exchange Plaid's public_token for the access_token
        Then I should get access_token and item_id
        When Create plaid item entry via user plaidinstitution endpoint
        Then I should get successful response from plaidinstituion endpoint
        When Polling transaction endpoint
        Then I should get transaction data returned after AllHistoricalPull is complete
        And Plaid fullySynced prop should be true
