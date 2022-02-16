Feature: Login

    Scenario: Should not Login with blank input fields
        Given I'm on login/sign up form
        When I leave login and password fields empty
        And Click submit
        Then I should see error prompt



