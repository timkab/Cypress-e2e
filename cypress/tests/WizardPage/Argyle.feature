Feature: Argyle Income Source

    Scenario: New user creates a sources and links Argyle 
        Given Created a new user and logged in
        And On Your details step
        When Selecting state and clicking continue
        Then Landing on Add & confirm your income step
        When Clicking Add income source
        Then Landing on Add Income Source step
        When Typing Uber and clicking connect Uber account
        Then Argyle is launched
        When Linking Uber via Argyle
        Then Landing on Add & confirm your income step