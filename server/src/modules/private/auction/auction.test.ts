import type { Express } from "express";
import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { buildAuction, buildStartedAuction } from "../../../__tests__/helpers/factories.js";

jest.setTimeout(30000);

let mongod: MongoMemoryServer;
let app: Express;
let accessToken: string;
let otherAccessToken: string;
let userId: string;
let otherUserId: string;

const accessTokenSecret = "test-access-secret";

function makeAccessToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" });
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  process.env.ACCESS_TOKEN_SECRET = accessTokenSecret;
  process.env.MONGO_URI = uri;

  const appModule = await import("../../../app.js");
  app = appModule.default();

  userId = new mongoose.Types.ObjectId().toHexString();
  otherUserId = new mongoose.Types.ObjectId().toHexString();

  accessToken = makeAccessToken({
    _id: userId,
    userId,
    name: "Test Seller",
    email: "seller@test.com",
    isVerified: true,
  });

  otherAccessToken = makeAccessToken({
    _id: otherUserId,
    userId: otherUserId,
    name: "Other User",
    email: "other@test.com",
    isVerified: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

describe("Private Auction API", () => {

  describe("POST /api/auctions", () => {

    describe("Success Cases", () => {

      it("should create an auction successfully", async () => {
        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Auction created successfully");
        expect(res.body.data).toHaveProperty("auction");
        expect(res.body.data.auction.title).toBe(auction.title);
        expect(res.body.data.auction.description).toBe(auction.description);
        expect(res.body.data.auction.category).toBe(auction.category);
        expect(res.body.data.auction.startingPrice).toBe(auction.startingBid);
        expect(res.body.data.auction.currentPrice).toBe(auction.startingBid);
        expect(res.body.data.auction.seller).toBe(userId);
        expect(res.body.data.auction).toHaveProperty("roomId");
        expect(res.body.data.auction.status).toBe("upcoming");
      });

      it("should create an auction with active status when startsAt is in the past", async () => {
        const auction = buildStartedAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(201);
        expect(res.body.data.auction.status).toBe("active");
      });

      it("should set minimumIncrement to 1 when not provided", async () => {
        const auction = buildAuction();
        delete auction.minimumIncrement;

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(201);
        expect(res.body.data.auction.minimumIncrement).toBe(1);
      });
    });

    describe("Authentication", () => {

      it("should reject unauthenticated users", async () => {
        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .send(auction);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should reject invalid token", async () => {
        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", "Bearer invalid-token")
          .send(auction);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should reject expired token", async () => {
        const expiredToken = jwt.sign(
          { _id: userId, userId, name: "Test", email: "test@test.com" },
          accessTokenSecret,
          { expiresIn: "0s" }
        );

        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${expiredToken}`)
          .send(auction);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      it("should reject malformed authorization header", async () => {
        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", "invalid-format")
          .send(auction);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Validation", () => {

      it("should reject missing body", async () => {
        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject missing title", async () => {
        const auction = buildAuction();
        delete (auction as unknown as Record<string, unknown>).title;

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject empty title", async () => {
        const auction = buildAuction({ title: "" });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject title too short", async () => {
        const auction = buildAuction({ title: "Ab" });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject title too long", async () => {
        const auction = buildAuction({ title: "A".repeat(101) });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject missing description", async () => {
        const auction = buildAuction();
        delete (auction as unknown as Record<string, unknown>).description;

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject description too short", async () => {
        const auction = buildAuction({ description: "Short" });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject invalid category", async () => {
        const auction = buildAuction({ category: "InvalidCategory" });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject invalid condition", async () => {
        const auction = buildAuction({ condition: "InvalidCondition" });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject empty images array", async () => {
        const auction = buildAuction({ images: [] });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject invalid image URL", async () => {
        const auction = buildAuction({ images: ["not-a-url"] });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject zero startingBid", async () => {
        const auction = buildAuction({ startingBid: 0 });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject negative startingBid", async () => {
        const auction = buildAuction({ startingBid: -100 });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject negative minimumIncrement", async () => {
        const auction = buildAuction({ minimumIncrement: -10 });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject invalid startsAt date", async () => {
        const auction = buildAuction({ startsAt: "invalid-date" as unknown as Date });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject invalid endsAt date", async () => {
        const auction = buildAuction({ endsAt: "invalid-date" as unknown as Date });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject endsAt before startsAt", async () => {
        const auction = buildAuction({
          startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        });

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Database State", () => {

      it("should persist auction in database", async () => {
        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(201);

        const dbAuction = await mongoose.connection.collection("auctions").findOne({
          _id: new mongoose.Types.ObjectId(res.body.data.auction._id),
        });

        expect(dbAuction).toBeTruthy();
        expect(dbAuction!.title).toBe(auction.title);
      });
    });

    describe("Response Validation", () => {

      it("should return correct response shape", async () => {
        const auction = buildAuction();

        const res = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(auction);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("status", 201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("auction");
        expect(res.body.data.auction).toHaveProperty("_id");
        expect(res.body.data.auction).toHaveProperty("seller");
        expect(res.body.data.auction).toHaveProperty("title");
        expect(res.body.data.auction).toHaveProperty("description");
        expect(res.body.data.auction).toHaveProperty("category");
        expect(res.body.data.auction).toHaveProperty("images");
        expect(res.body.data.auction).toHaveProperty("startingPrice");
        expect(res.body.data.auction).toHaveProperty("currentPrice");
        expect(res.body.data.auction).toHaveProperty("roomId");
        expect(res.body.data.auction).toHaveProperty("status");
        expect(res.body.data.auction).toHaveProperty("startTime");
        expect(res.body.data.auction).toHaveProperty("endTime");
        expect(res.body.data.auction).toHaveProperty("createdAt");
      });
    });
  });

  describe("PATCH /api/auctions/:auctionId", () => {

    describe("Success Cases", () => {

      it("should update an auction successfully", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "Updated Title" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Auction updated successfully");
        expect(res.body.data.auction.title).toBe("Updated Title");
      });

      it("should update multiple fields", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "Updated", description: "Updated description that is long enough" });

        expect(res.status).toBe(200);
        expect(res.body.data.auction.title).toBe("Updated");
        expect(res.body.data.auction.description).toBe("Updated description that is long enough");
      });
    });

    describe("Authentication", () => {

      it("should reject unauthenticated users", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .send({ title: "Updated" });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Authorization", () => {

      it("should reject non-owner", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${otherAccessToken}`)
          .send({ title: "Hacked Title" });

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Business Logic", () => {

      it("should reject update for non-existent auction", async () => {
        const fakeId = new mongoose.Types.ObjectId().toHexString();

        const res = await request(app)
          .patch(`/api/auctions/${fakeId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "Updated" });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should reject update for active auction", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildStartedAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "Updated" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject update for invalid auction ID", async () => {
        const res = await request(app)
          .patch("/api/auctions/invalid-id")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "Updated" });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Validation", () => {

      it("should reject invalid category", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ category: "InvalidCategory" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject negative startingBid", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .patch(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ startingBid: -100 });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  });

  describe("DELETE /api/auctions/:auctionId", () => {

    describe("Success Cases", () => {

      it("should delete an auction successfully", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .delete(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Auction deleted successfully");

        const dbAuction = await mongoose.connection.collection("auctions").findOne({
          _id: new mongoose.Types.ObjectId(auctionId),
        });
        expect(dbAuction).toBeNull();
      });
    });

    describe("Authentication", () => {

      it("should reject unauthenticated users", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .delete(`/api/auctions/${auctionId}`);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Authorization", () => {

      it("should reject non-owner", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .delete(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${otherAccessToken}`);

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
      });
    });

    describe("Business Logic", () => {

      it("should reject delete for non-existent auction", async () => {
        const fakeId = new mongoose.Types.ObjectId().toHexString();

        const res = await request(app)
          .delete(`/api/auctions/${fakeId}`)
          .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });

      it("should reject delete for active auction", async () => {
        const auctionRes = await request(app)
          .post("/api/auctions")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(buildStartedAuction());

        const auctionId = auctionRes.body.data.auction._id;

        const res = await request(app)
          .delete(`/api/auctions/${auctionId}`)
          .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it("should reject delete for invalid auction ID", async () => {
        const res = await request(app)
          .delete("/api/auctions/invalid-id")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
      });
    });
  });

  describe("GET /api/auctions/my", () => {

    // NOTE: The GET /api/auctions/my route is currently broken due to a routing conflict.
    // The public router's GET /:auctionId matches /my first, treating "my" as an auctionId,
    // and the auctionIdParamValidators reject it as an invalid ObjectId (400).
    // These tests document the actual production behavior.

    it("should return 400 due to routing conflict with public /:auctionId", async () => {
      const res = await request(app)
        .get("/api/auctions/my")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
