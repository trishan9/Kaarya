import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "@/app"; // Ensure your Express app is exported from src/app.ts
import path from "path";

// Load the feature file using an absolute/relative path
const feature = loadFeature(path.resolve(__dirname, "../../tests/features/auth.feature"));

defineFeature(feature, (test) => {
  let response: request.Response;
  let uniqueEmail: string; // to store a unique email for registration and login
  const userPayload = {
    name: "John Doe",
    email: "john@example.com", // this will be overridden with a unique email
    password: "pass123", // valid password (6-10 characters)
  };

  test("Successful user registration and login", ({ given, when, then, and }) => {
    given(
      /^a new user with name "([^"]*)", email "([^"]*)", and password "([^"]*)"$/,
      (name, email, password) => {
        userPayload.name = name;
        // Generate a unique email to avoid conflicts (e.g., if the user already exists)
        uniqueEmail = `testuser+${Date.now()}@example.com`;
        userPayload.email = uniqueEmail;
        userPayload.password = password;
      }
    );

    when("the user signs up", async () => {
      response = await request(app)
        .post("/api/v1/auth/register")
        .send(userPayload);
    });

    then("the response status should be 201", () => {
      expect(response.status).toBe(StatusCodes.CREATED);
    });

    and('the response should contain a user object with an "id"', () => {
      expect(response.body.data).toHaveProperty("id");
    });

    when("the user logs in", async () => {
      // Use the unique email from registration for login.
      response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: uniqueEmail,
          password: userPayload.password,
        });
    });

    then("the response status should be 200", () => {
      expect(response.status).toBe(StatusCodes.OK);
    });

    and('the response should contain an "accessToken" and "streamToken"', () => {
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("streamToken");
    });

    and('a cookie named "refreshToken" is set', () => {
      const cookies = response.headers["set-cookie"];
      // Handle cookies whether they come as a string or an array:
      const cookieString = Array.isArray(cookies) ? cookies.join("") : cookies;
      expect(cookieString).toMatch(/refreshToken/);
    });
  });
});
