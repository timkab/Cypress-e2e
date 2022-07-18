Feature: Plaid Income Source

    Scenario: New user creates a sources and links Plaid
        Given Created a new user and logged in
        And On Your details step
        When Selecting state and clicking continue
        Then Landing on Add & confirm your income step
        When Clicking Add income source
        Then Landing on Add Income Source step
        When Adding source name
        Then Landing on Select the bank accounts... step
        When Click Connect an account
        Then Plaid webview is launched
        When Linking Wells Fargo via Plaid webview
        Then Landing on Select the bank accounts... step
        When Selecting linked Bank and clicking Done
        Then Landing on Add & confirm your income step

        