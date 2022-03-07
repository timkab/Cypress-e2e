@feature-tag
Feature: Intro Home Page

    Background:
        Given Im in logged out state
        And on passport intro page

    @tag-1
    Scenario: Switch language preference
        Given Language cta is present
        When I click Language cta
        Then I see Choose language module
        When I click Espanol
        And Close Choose language module
        Then I see landing page
        And Intro and CTA text is in Spanish

    @tag-2
    Scenario: Open Terms and conditions
        Given Terms link present and clickable
        When I click Terms link
        Then I should land on Terms and condition page


