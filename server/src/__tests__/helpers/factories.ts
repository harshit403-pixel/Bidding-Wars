import { randomUUID } from "node:crypto";

export interface UserFactory {
  name: string;
  email: string;
  password: string;
}

export interface InvalidUserFactory {
  name?: string;
  email?: string;
  password?: string;
}

export function buildUser(
  overrides: Partial<UserFactory> = {},
): UserFactory {
  const id = randomUUID();

  return {
    name: "Test User",
    email: `user-${id}@gmail.com`,
    password: "Password@123",
    ...overrides,
  };
}

export function buildAdmin(
  overrides: Partial<UserFactory> = {},
): UserFactory {
  const id = randomUUID();

  return {
    name: "Admin User",
    email: `admin-${id}@gmail.com`,
    password: "Admin@123",
    ...overrides,
  };
}

export function buildInvalidUser(
  overrides: Partial<InvalidUserFactory> = {},
): InvalidUserFactory {
  return {
    name: "",
    email: "invalid-email",
    password: "123",
    ...overrides,
  };
}

export function buildForgotPasswordRequest(
  email: string,
) {
  return {
    email,
  };
}

export function buildResetPasswordRequest(
  token: string,
  password = "NewPassword@123",
) {
  return {
    token,
    password,
  };
}

export function buildLoginRequest(
  email: string,
  password: string,
) {
  return {
    email,
    password,
  };
}

export function buildGoogleLoginRequest(
  credential = "fake-google-token",
) {
  return {
    credential,
  };
}