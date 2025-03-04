Feature: Authentication
  In order to access protected resources
  As a user of the system
  I want to sign up and log in

  Scenario: Successful user registration and login
    Given a new user with name "John Doe", email "john@example.com", and password "pass123"
    When the user signs up
    Then the response status should be 201
    And the response should contain a user object with an "id"
    When the user logs in
    Then the response status should be 200
    And the response should contain an "accessToken" and "streamToken"
    And a cookie named "refreshToken" is set
