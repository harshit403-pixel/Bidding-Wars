import type { Express } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { jest } from "@jest/globals";
import { buildUser } from "./helpers/factories.js";

type MockUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  providers: string[];
  isVerified: boolean;
  googleId?: string;
  comparePassword: jest.MockedFunction<
    (password: string) => Promise<boolean>
  >;
  save: jest.MockedFunction<() => Promise<MockUser>>;
};

type TokenPayload = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  isVerified: boolean;
};

type HttpError = Error & {
  statusCode: number;
};

type CookieResponse = {
  cookie: (name: string, value: string) => void;
};

type SessionLookupResult = {
  _id: string;
  userId: string;
};

type DeleteResultLike = {
  deletedCount: number;
};

type TokenRecord = {
  value: string;
};

type StoredToken = {
  email: string;
  value: string;
};

type GoogleUser = {
  googleId: string;
  email: string;
  name: string;
  picture: string;
};

type CreateSessionResult = {
  sanitizedUser: TokenPayload;
  accessToken: string;
};

type CreateUserFn = (userData: Partial<MockUser>) => Promise<MockUser>;
type FindUserByEmailFn = (email: string) => Promise<MockUser | null>;
type FindUserByIdFn = (id: string) => Promise<MockUser | null>;
type UpdateUserByIdFn = (
  id: string,
  updateData: Record<string, unknown>,
) => Promise<MockUser | null>;
type DeleteUserByIdFn = (id: string) => Promise<MockUser | null>;
type CreateSessionRecordFn = (
  sessionData: Record<string, unknown>,
) => Promise<Record<string, unknown>>;
type FindSessionByRefreshTokenAndSessionIdFn = (
  refreshToken: string,
  sessionId: string,
) => Promise<SessionLookupResult | null>;
type DeleteSessionByRefreshTokenAndSessionIdFn = (
  refreshToken: string,
  sessionId: string,
) => Promise<Record<string, unknown> | null>;
type DeleteSessionByUserIdFn = (userId: string) => Promise<DeleteResultLike>;
type FindSessionByIdFn = (
  id: string,
) => Promise<Record<string, unknown> | null>;
type CreateTokenFn = (
  tokenData: Record<string, unknown>,
) => Promise<TokenRecord>;
type FindTokenByValueFn = (value: string) => Promise<StoredToken | null>;
type DeleteTokenByValueFn = (value: string) => Promise<DeleteResultLike>;
type DeleteTokenByEmailFn = (
  email: string,
  type: string,
) => Promise<DeleteResultLike>;
type CreateSessionFn = (
  user: MockUser,
  res: CookieResponse,
) => Promise<CreateSessionResult>;
type SendMailFn = (to: string, subject: string, html: string) => void;
type GetGoogleAuthorizationUrlFn = (state: string) => string;
type GetGoogleUserFromCodeFn = (code: string) => Promise<GoogleUser>;
type VerifyGoogleTokenFn = (credential: string) => Promise<GoogleUser>;

const mockCreateUser = jest.fn<CreateUserFn>();
const mockFindUserByEmail = jest.fn<FindUserByEmailFn>();
const mockFindUserById = jest.fn<FindUserByIdFn>();
const mockUpdateUserById = jest.fn<UpdateUserByIdFn>();
const mockDeleteUserById = jest.fn<DeleteUserByIdFn>();

const mockCreateSessionRecord = jest.fn<CreateSessionRecordFn>();
const mockFindSessionByRefreshTokenandSessionId =
  jest.fn<FindSessionByRefreshTokenAndSessionIdFn>();
const mockDeleteSessionByRefreshTokenandSessionId =
  jest.fn<DeleteSessionByRefreshTokenAndSessionIdFn>();
const mockDeleteSessionByUserId = jest.fn<DeleteSessionByUserIdFn>();
const mockFindSessionById = jest.fn<FindSessionByIdFn>();

const mockCreateToken = jest.fn<CreateTokenFn>();
const mockFindTokenByValue = jest.fn<FindTokenByValueFn>();
const mockDeleteTokenByValue = jest.fn<DeleteTokenByValueFn>();
const mockDeleteTokenByEmail = jest.fn<DeleteTokenByEmailFn>();

const mockCreateSession = jest.fn<CreateSessionFn>();
const mockSendMail = jest.fn<SendMailFn>();
const mockGetGoogleAuthorizationUrl = jest.fn<GetGoogleAuthorizationUrlFn>(
  () => "https://accounts.google.com/o/oauth2/v2/auth",
);
const mockGetGoogleUserFromCode = jest.fn<GetGoogleUserFromCodeFn>();
const mockVerifyGoogleToken = jest.fn<VerifyGoogleTokenFn>();
const mockLoggerError = jest.fn<(err: unknown) => void>();
const mockLoggerInfo = jest.fn<(message: string) => void>();
const mockLoggerDebug = jest.fn<(message: string) => void>();
const mockLoggerWarn = jest.fn<(message: string) => void>();

const createHttpError = (statusCode: number, message: string): HttpError =>
  Object.assign(new Error(message), { statusCode });

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "test-access-secret";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET ?? "test-refresh-secret";

let userCounter = 0;

function createStoredUser(overrides: Partial<MockUser> = {}): MockUser {
  userCounter += 1;

  const user = {
    _id: `user-${userCounter}`,
    name: "Test User",
    email: `user-${userCounter}@example.com`,
    password: "Password@123",
    providers: ["local"],
    isVerified: false,
    comparePassword: jest.fn<(password: string) => Promise<boolean>>(),
    save: jest.fn<() => Promise<MockUser>>(),
  } as MockUser;

  Object.assign(user, overrides);

  user.comparePassword.mockImplementation(
    async (candidate: string) => candidate === user.password,
  );
  user.save.mockImplementation(async () => user);

  return user;
}

function toTokenPayload(user: MockUser): TokenPayload {
  return {
    _id: user._id,
    userId: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };
}

function makeAccessToken(user: MockUser) {
  return jwt.sign(toTokenPayload(user), accessTokenSecret, { expiresIn: "15m" });
}

function makeRefreshToken(user: MockUser, sessionId = `session-${user._id}`) {
  return jwt.sign({ sessionId, userId: user._id }, refreshTokenSecret, { expiresIn: "7d" });
}

jest.unstable_mockModule("../shared/dao/user.dao.js", () => ({
  default: class UserDao {
    createUser = mockCreateUser;
    findUserByEmail = mockFindUserByEmail;
    findUserById = mockFindUserById;
    updateUserById = mockUpdateUserById;
    deleteUserById = mockDeleteUserById;
  },
}));

jest.unstable_mockModule("../shared/dao/session.dao.js", () => ({
  default: class SessionDao {
    createSession = mockCreateSessionRecord;
    findSessionByRefreshTokenandSessionId = mockFindSessionByRefreshTokenandSessionId;
    deleteSessionByRefreshTokenandSessionId = mockDeleteSessionByRefreshTokenandSessionId;
    deleteSessionByUserId = mockDeleteSessionByUserId;
    findById = mockFindSessionById;
  },
}));

jest.unstable_mockModule("../shared/dao/token.dao.js", () => ({
  default: class TokenDao {
    createToken = mockCreateToken;
    findTokenByValue = mockFindTokenByValue;
    deleteTokenByValue = mockDeleteTokenByValue;
    deleteTokenByEmail = mockDeleteTokenByEmail;
  },
}));

jest.unstable_mockModule("../shared/utils/createSession.util.js", () => ({
  default: mockCreateSession,
}));

jest.unstable_mockModule("../shared/utils/sendMail.util.js", () => ({
  default: mockSendMail,
}));

jest.unstable_mockModule("../shared/utils/googleAuth.util.js", () => ({
  getGoogleAuthorizationUrl: mockGetGoogleAuthorizationUrl,
  getGoogleUserFromCode: mockGetGoogleUserFromCode,
  verifyGoogleToken: mockVerifyGoogleToken,
}));

jest.unstable_mockModule("../shared/config/logger.config.js", () => ({
  default: {
    error: mockLoggerError,
    info: mockLoggerInfo,
    debug: mockLoggerDebug,
    warn: mockLoggerWarn,
  },
}));

let app: Express;

beforeAll(async () => {
  const appModule = await import("../app.js");
  app = appModule.default();
});

beforeEach(() => {
  mockCreateUser.mockImplementation(async (userData) =>
    createStoredUser({
      name: (userData.name as string) ?? "Test User",
      email: (userData.email as string) ?? `user-${userCounter + 1}@example.com`,
      password: (userData.password as string) ?? "Password@123",
      providers: (userData.providers as string[]) ?? ["local"],
      isVerified: (userData.isVerified as boolean) ?? false,
      googleId: userData.googleId as string | undefined,
    }),
  );
  mockFindUserByEmail.mockResolvedValue(null);
  mockFindUserById.mockResolvedValue(null);
  mockUpdateUserById.mockResolvedValue(null);
  mockDeleteUserById.mockResolvedValue(null);

  mockCreateSessionRecord.mockResolvedValue({});
  mockFindSessionByRefreshTokenandSessionId.mockResolvedValue(null);
  mockDeleteSessionByRefreshTokenandSessionId.mockResolvedValue({});
  mockDeleteSessionByUserId.mockResolvedValue({ deletedCount: 1 });
  mockFindSessionById.mockResolvedValue(null);

  mockCreateToken.mockResolvedValue({ value: "token-123" });
  mockFindTokenByValue.mockResolvedValue(null);
  mockDeleteTokenByValue.mockResolvedValue({ deletedCount: 1 });
  mockDeleteTokenByEmail.mockResolvedValue({ deletedCount: 0 });

  mockCreateSession.mockImplementation(async (user, res) => {
    const refreshToken = makeRefreshToken(user);
    res.cookie("refreshToken", refreshToken);

    return {
      sanitizedUser: toTokenPayload(user),
      accessToken: makeAccessToken(user),
    };
  });

  mockSendMail.mockReturnValue(undefined);
  mockGetGoogleAuthorizationUrl.mockReturnValue("https://accounts.google.com/o/oauth2/v2/auth");
  mockGetGoogleUserFromCode.mockResolvedValue({
    googleId: "google-123",
    email: "google-user@example.com",
    name: "Google User",
    picture: "https://example.com/avatar.png",
  });
  mockVerifyGoogleToken.mockRejectedValue(
    createHttpError(400, "Invalid Google credentials"),
  );
});

describe("Authentication API", () => {
  describe("POST /api/auth/signup", () => {
    it("should signup a new user", async () => {
      const user = buildUser();

      const res = await request(app).post("/api/auth/signup").send(user);

      expect(res.status).toBe(201);
      expect(res.body.message).toBeDefined();
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data.user.email).toBe(user.email);
      expect(res.body.data.user.name).toBe(user.name);
      expect(mockCreateToken).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });

    it("should not allow duplicate email", async () => {
      const user = buildUser();

      mockCreateUser
        .mockResolvedValueOnce(
          createStoredUser({
            name: user.name,
            email: user.email,
            password: user.password,
          }),
        )
        .mockRejectedValueOnce(createHttpError(409, "User already exists"));

      await request(app).post("/api/auth/signup").send(user);
      const res = await request(app).post("/api/auth/signup").send(user);

      expect(res.status).toBe(409);
    });

    it("should reject invalid email", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        ...buildUser(),
        email: "invalid-email",
      });

      expect(res.status).toBe(400);
    });

    it("should reject empty name", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        ...buildUser(),
        name: "",
      });

      expect(res.status).toBe(400);
    });

    it("should reject short password", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        ...buildUser(),
        password: "123",
      });

      expect(res.status).toBe(400);
    });

    it("should reject missing body", async () => {
      const res = await request(app).post("/api/auth/signup").send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      const user = buildUser();
      const storedUser = createStoredUser({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      mockFindUserByEmail.mockResolvedValue(storedUser);

      const res = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: user.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(user.email);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should fail if user does not exist", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nouser@gmail.com",
        password: "Password@123",
      });

      expect(res.status).toBe(404);
    });

    it("should fail with incorrect password", async () => {
      const user = buildUser();
      const storedUser = createStoredUser({
        email: user.email,
        password: user.password,
      });

      storedUser.comparePassword.mockResolvedValue(false);
      mockFindUserByEmail.mockResolvedValue(storedUser);

      const res = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: "WrongPassword123",
      });

      expect(res.status).toBe(401);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "abc",
        password: "Password@123",
      });

      expect(res.status).toBe(400);
    });

    it("should reject missing password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "abc@gmail.com",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return authenticated user", async () => {
      const storedUser = createStoredUser();
      const accessToken = makeAccessToken(storedUser);

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data.user.email).toBe(storedUser.email);
      expect(res.body.data.user.name).toBe(storedUser.name);
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });

    it("should fail with malformed authorization header", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "invalid-token");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh access token", async () => {
      const storedUser = createStoredUser();
      const sessionId = `session-${storedUser._id}`;
      const refreshToken = makeRefreshToken(storedUser, sessionId);

      mockFindSessionByRefreshTokenandSessionId.mockResolvedValue({
        _id: sessionId,
        userId: storedUser._id,
      });
      mockFindUserById.mockResolvedValue(storedUser);

      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", [`refreshToken=${refreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("user");
    });

    it("should fail without refresh cookie", async () => {
      const res = await request(app).post("/api/auth/refresh");

      expect(res.status).toBe(401);
    });

    it("should reject invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", ["refreshToken=invalid-token"]);

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const storedUser = createStoredUser();
      const refreshToken = makeRefreshToken(storedUser);

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", [`refreshToken=${refreshToken}`]);

      expect(res.status).toBe(200);
      expect(mockDeleteSessionByRefreshTokenandSessionId).toHaveBeenCalledTimes(1);
    });

    it("should succeed even if user is already logged out", async () => {
      const storedUser = createStoredUser();
      const refreshToken = makeRefreshToken(storedUser);

      mockDeleteSessionByRefreshTokenandSessionId.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", [`refreshToken=${refreshToken}`]);

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/auth/logoutall", () => {
    it("should logout from all sessions", async () => {
      const storedUser = createStoredUser();
      const accessToken = makeAccessToken(storedUser);

      const res = await request(app)
        .post("/api/auth/logoutall")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(mockDeleteSessionByUserId).toHaveBeenCalledWith(storedUser._id);
    });

    it("should fail without token", async () => {
      const res = await request(app).post("/api/auth/logoutall");

      expect(res.status).toBe(401);
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/logoutall")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should send reset password email", async () => {
      const user = buildUser();

      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: user.email });

      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
      expect(mockDeleteTokenByEmail).toHaveBeenCalledWith(user.email, "reset");
      expect(mockCreateToken).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });

    it("should reject invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "invalid-email" });

      expect(res.status).toBe(400);
    });

    it("should reject missing email", async () => {
      const res = await request(app).post("/api/auth/forgot-password").send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should fail with invalid reset token", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "invalid-token",
          password: "NewPassword@123",
        });

      expect(res.status).toBe(404);
    });

    it("should reject missing token", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          password: "NewPassword@123",
        });

      expect(res.status).toBe(400);
    });

    it("should reject missing password", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "abcd",
        });

      expect(res.status).toBe(400);
    });

    it("should reject weak password", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          token: "abcd",
          password: "123",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/google-login", () => {
    it("should reject invalid google credential", async () => {
      const res = await request(app)
        .post("/api/auth/google-login")
        .send({
          credential: "invalid-google-token",
        });

      expect(res.status).toBe(400);
    });

    it("should reject missing credential", async () => {
      const res = await request(app).post("/api/auth/google-login").send({});

      expect(res.status).toBe(400);
    });
  });

  describe("Security", () => {
    it("should not allow invalid authorization header", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Invalid Header");

      expect(res.status).toBe(401);
    });

    it("should reject unsupported http method", async () => {
      const res = await request(app).put("/api/auth/login").send({});

      expect([404, 405]).toContain(res.status);
    });

    it("should return 404 for unknown auth route", async () => {
      const res = await request(app).get("/api/auth/random-route");

      expect(res.status).toBe(404);
    });
  });
});
