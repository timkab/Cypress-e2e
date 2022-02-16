@feature-tag
Feature: Intro Home Page

    Background:
        Given I in logged out state
        And on passport intro page

    @tag-1
    Scenario: Click Get Started cta
        Given Get Started cta is present and clickable
        When I click Get Started
        Then I see login sign up form

    @tag-2
    Scenario: Open Terms and conditions
        Given Terms link present and clickable
        When I click Terms link
        Then I should land on Terms and condition page

    @tag-3
    Scenario: Click Login
        Given Login cta is present and clickable
        When I click Login
        Then I see login sign up form
