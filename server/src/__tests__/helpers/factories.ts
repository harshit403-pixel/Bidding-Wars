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

// Auction factory types
export interface AuctionFactory {
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  startingBid: number;
  minimumIncrement?: number;
  startsAt: Date;
  endsAt: Date;
}

// Build a valid auction payload
export function buildAuction(
  overrides: Partial<AuctionFactory> = {},
): AuctionFactory {
  const id = randomUUID();

  return {
    title: `Test Auction ${id.slice(0, 8)}`,
    description: "This is a test auction description that is long enough to pass validation requirements.",
    category: "Electronics",
    condition: "New",
    images: ["https://example.com/image1.jpg"],
    startingBid: 100,
    minimumIncrement: 10,
    startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    ...overrides,
  };
}

// Build an auction that has already started
export function buildStartedAuction(
  overrides: Partial<AuctionFactory> = {},
): AuctionFactory {
  return buildAuction({
    startsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    ...overrides,
  });
}

// Build an ended auction
export function buildEndedAuction(
  overrides: Partial<AuctionFactory> = {},
): AuctionFactory {
  return buildAuction({
    startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    ...overrides,
  });
}

// Build an invalid auction payload
export function buildInvalidAuction(
  overrides: Partial<Record<string, unknown>> = {},
) {
  return {
    title: "",
    description: "",
    category: "InvalidCategory",
    condition: "InvalidCondition",
    images: [],
    startingBid: -100,
    startsAt: "invalid-date",
    endsAt: "invalid-date",
    ...overrides,
  };
}