import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { io as ClientSocket, Socket as ClientSocketType } from "socket.io-client";
import { initSocket, getIO } from "./socket.js";
import Auction from "../models/auction.model.js";
import User from "../models/user.model.js";
import Bid from "../models/bid.model.js";
import Timeline from "../models/timeline.model.js";

jest.setTimeout(30000);

let mongod: MongoMemoryServer;
let httpServer: ReturnType<typeof createServer>;
let io: Server;
let clientSocket: ClientSocketType;
let clientSocket2: ClientSocketType;

const accessTokenSecret = "test-access-secret";
const userId = new mongoose.Types.ObjectId().toHexString();
const sellerId = new mongoose.Types.ObjectId().toHexString();
const otherUserId = new mongoose.Types.ObjectId().toHexString();

function makeAccessToken(payload: Record<string, unknown>) {
    return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" });
}

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    process.env.ACCESS_TOKEN_SECRET = accessTokenSecret;
    process.env.NODE_ENV = "test";

    httpServer = createServer();
    io = initSocket(httpServer);

    await new Promise<void>((resolve) => {
        httpServer.listen(0, () => resolve());
    });
});

afterAll(async () => {
    if (clientSocket?.connected) clientSocket.disconnect();
    if (clientSocket2?.connected) clientSocket2.disconnect();
    io.close();
    httpServer.close();
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await Auction.deleteMany({});
    await User.deleteMany({});
    await Bid.deleteMany({});
    await Timeline.deleteMany({});
});

function createClientSocket(token?: string): ClientSocketType {
    const port = (httpServer.address() as { port: number }).port;
    const auth = token ? { token } : undefined;
    return ClientSocket(`http://localhost:${port}`, { auth, reconnection: false, forceNew: true });
}

describe("Socket.io Connection", () => {
    it("should connect with valid token", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Test User", email: "test@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("connect", () => {
            expect(clientSocket.connected).toBe(true);
            done();
        });

        clientSocket.on("connect_error", (err) => {
            done(err);
        });
    });

    it("should reject connection without token", (done) => {
        const socket = createClientSocket();
        socket.on("connect_error", (err) => {
            expect(err.message).toBe("Authentication required");
            socket.disconnect();
            done();
        });

        socket.on("connect", () => {
            socket.disconnect();
            done(new Error("Should not connect"));
        });
    });

    it("should reject connection with invalid token", (done) => {
        const socket = createClientSocket("invalid-token");
        socket.on("connect_error", (err) => {
            expect(err.message).toBe("Invalid or expired token");
            socket.disconnect();
            done();
        });

        socket.on("connect", () => {
            socket.disconnect();
            done(new Error("Should not connect"));
        });
    });

    it("should disconnect and clean up", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Test User", email: "test@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("connect", () => {
            clientSocket.disconnect();
        });

        clientSocket.on("disconnect", () => {
            expect(clientSocket.connected).toBe(false);
            done();
        });
    });
});

describe("Socket.io Room Management", () => {
    let auctionId: string;
    let roomId: string;

    beforeEach(async () => {
        roomId = `room-${Date.now()}`;
        const auction = await Auction.create({
            seller: sellerId,
            title: "Test Auction for Socket",
            description: "A test auction for socket testing",
            category: "Electronics",
            startingPrice: 100,
            currentPrice: 100,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() + 3600000),
            roomId,
            totalBids: 0,
            participantsCount: 0,
            minimumIncrement: 10,
        });
        auctionId = auction._id.toString();

        await User.create([
            { _id: userId, name: "Bidder", email: "bidder@test.com", password: "hashed123", providers: ["local"] },
            { _id: sellerId, name: "Seller", email: "seller@test.com", password: "hashed123", providers: ["local"] },
            { _id: otherUserId, name: "Other", email: "other@test.com", password: "hashed123", providers: ["local"] },
        ]);
    });

    afterEach(() => {
        if (clientSocket?.connected) clientSocket.disconnect();
        if (clientSocket2?.connected) clientSocket2.disconnect();
    });

    it("should join auction room and receive auction_state", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("auction_state", (state) => {
            expect(state).toHaveProperty("auction");
            expect(state).toHaveProperty("currentPrice");
            expect(state).toHaveProperty("remainingSeconds");
            expect(state).toHaveProperty("participants");
            expect(state).toHaveProperty("status");
            expect(state.status).toBe("active");
            expect(state.currentPrice).toBe(100);
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
        });
    });

    it("should broadcast user_joined to other participants", (done) => {
        const token1 = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        const token2 = makeAccessToken({ _id: otherUserId, userId: otherUserId, name: "Other", email: "other@test.com", isVerified: true });

        clientSocket = createClientSocket(token1);

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });

            clientSocket2 = createClientSocket(token2);
            clientSocket2.on("user_joined", (data) => {
                expect(data.username).toBe("Other");
                expect(data.participants).toBe(2);
                done();
            });

            clientSocket2.on("connect", () => {
                clientSocket2.emit("join_auction", { roomId });
            });
        });
    });

    it("should broadcast user_left when leaving", (done) => {
        const token1 = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        const token2 = makeAccessToken({ _id: otherUserId, userId: otherUserId, name: "Other", email: "other@test.com", isVerified: true });

        clientSocket = createClientSocket(token1);
        clientSocket2 = createClientSocket(token2);

        let joinedCount = 0;

        const checkBothJoined = () => {
            joinedCount++;
            if (joinedCount === 2) {
                clientSocket2.emit("leave_auction", { roomId });
            }
        };

        clientSocket.on("user_left", (data) => {
            expect(data.username).toBe("Other");
            expect(data.participants).toBe(1);
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            checkBothJoined();
        });

        clientSocket2.on("connect", () => {
            clientSocket2.emit("join_auction", { roomId });
            checkBothJoined();
        });
    });

    it("should reject join with invalid room", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("socket_error", (err) => {
            expect(err.code).toBe("INVALID_ROOM");
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId: "nonexistent-room" });
        });
    });

    it("should update participants count on join/leave", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("participants_updated", (data) => {
            if (data.participants === 1) {
                done();
            }
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
        });
    });
});

describe("Socket.io Bid Placement", () => {
    let auctionId: string;
    let roomId: string;

    beforeEach(async () => {
        roomId = `room-bid-${Date.now()}`;
        const auction = await Auction.create({
            seller: sellerId,
            title: "Bid Test Auction",
            description: "Testing bid placement",
            category: "Electronics",
            startingPrice: 100,
            currentPrice: 100,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() + 3600000),
            roomId,
            totalBids: 0,
            participantsCount: 0,
            minimumIncrement: 10,
        });
        auctionId = auction._id.toString();

        await User.create([
            { _id: userId, name: "Bidder", email: "bidder@test.com", password: "hashed123", providers: ["local"] },
            { _id: sellerId, name: "Seller", email: "seller@test.com", password: "hashed123", providers: ["local"] },
        ]);
    });

    afterEach(() => {
        if (clientSocket?.connected) clientSocket.disconnect();
    });

    it("should place a valid bid and broadcast new_highest_bid", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("new_highest_bid", (data) => {
            expect(data.amount).toBe(110);
            expect(data.highestBidder.name).toBe("Bidder");
            expect(data.auction.currentPrice).toBe(110);
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 110 });
            }, 100);
        });
    });

    it("should reject bid below minimum increment", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("socket_error", (err) => {
            expect(err.code).toBe("BID_TOO_LOW");
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 105 });
            }, 100);
        });
    });

    it("should reject bid from seller", (done) => {
        const sellerToken = makeAccessToken({ _id: sellerId, userId: sellerId, name: "Seller", email: "seller@test.com", isVerified: true });
        clientSocket = createClientSocket(sellerToken);

        clientSocket.on("socket_error", (err) => {
            expect(err.code).toBe("SELLER_BID_REJECTED");
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 110 });
            }, 100);
        });
    });

    it("should reject bid on ended auction", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        Auction.findByIdAndUpdate(auctionId, { status: "ended" }).exec();

        clientSocket.on("socket_error", (err) => {
            expect(err.code).toBe("AUCTION_NOT_ACTIVE");
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 110 });
            }, 100);
        });
    });

    it("should reject bid with invalid amount (NaN)", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("socket_error", (err) => {
            expect(err.code).toBe("INVALID_AMOUNT");
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: NaN });
            }, 100);
        });
    });

    it("should reject bid with negative amount", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("socket_error", (err) => {
            expect(err.code).toBe("INVALID_AMOUNT");
            done();
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: -50 });
            }, 100);
        });
    });

    it("should reject unauthenticated connection (prevents bidding)", (done) => {
        const socket = createClientSocket();

        socket.on("connect_error", (err) => {
            expect(err.message).toBe("Authentication required");
            expect(socket.connected).toBe(false);
            done();
        });

        socket.on("connect", () => {
            socket.disconnect();
            done(new Error("Should not connect without token"));
        });
    });

    it("should create a timeline event for placed bid", async () => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        await new Promise<void>((resolve) => {
            clientSocket.on("new_highest_bid", () => {
                resolve();
            });

            clientSocket.on("connect", () => {
                clientSocket.emit("join_auction", { roomId });
                setTimeout(() => {
                    clientSocket.emit("place_bid", { roomId, auctionId, amount: 150 });
                }, 100);
            });
        });

        const events = await Timeline.find({ auction: auctionId, type: "BID_PLACED" });
        expect(events).toHaveLength(1);
        expect(events[0].metadata).toHaveProperty("amount", 150);
    });
});

describe("Socket.io Rate Limiting", () => {
    let auctionId: string;
    let roomId: string;

    beforeEach(async () => {
        roomId = `room-rate-${Date.now()}`;
        const auction = await Auction.create({
            seller: sellerId,
            title: "Rate Limit Test",
            description: "Testing rate limiting",
            category: "Electronics",
            startingPrice: 100,
            currentPrice: 100,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() + 3600000),
            roomId,
            totalBids: 0,
            participantsCount: 0,
            minimumIncrement: 10,
        });
        auctionId = auction._id.toString();

        await User.create([
            { _id: userId, name: "Bidder", email: "bidder@test.com", password: "hashed123", providers: ["local"] },
            { _id: sellerId, name: "Seller", email: "seller@test.com", password: "hashed123", providers: ["local"] },
        ]);
    });

    afterEach(() => {
        if (clientSocket?.connected) clientSocket.disconnect();
    });

    it("should rate limit rapid bids", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        let bidCount = 0;
        let doneCalled = false;

        clientSocket.on("socket_error", (err) => {
            if (err.code === "RATE_LIMITED" && !doneCalled) {
                doneCalled = true;
                done();
            }
        });

        clientSocket.on("new_highest_bid", () => {
            bidCount++;
            if (bidCount === 1) {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 120 });
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 130 });
            }
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
            setTimeout(() => {
                clientSocket.emit("place_bid", { roomId, auctionId, amount: 110 });
            }, 100);
        });
    });
});

describe("Socket.io Reconnection", () => {
    let auctionId: string;
    let roomId: string;

    beforeEach(async () => {
        roomId = `room-reconnect-${Date.now()}`;
        const auction = await Auction.create({
            seller: sellerId,
            title: "Reconnect Test",
            description: "Testing reconnection",
            category: "Electronics",
            startingPrice: 100,
            currentPrice: 150,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() + 3600000),
            roomId,
            totalBids: 2,
            participantsCount: 0,
            minimumIncrement: 10,
        });
        auctionId = auction._id.toString();

        await User.create([
            { _id: userId, name: "Bidder", email: "bidder@test.com", password: "hashed123", providers: ["local"] },
            { _id: sellerId, name: "Seller", email: "seller@test.com", password: "hashed123", providers: ["local"] },
        ]);
    });

    afterEach(() => {
        if (clientSocket?.connected) clientSocket.disconnect();
    });

    it("should receive auction state after rejoining room", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        let stateReceived = 0;

        clientSocket.on("auction_state", (state) => {
            stateReceived++;
            if (stateReceived === 1) {
                clientSocket.disconnect();

                clientSocket2 = createClientSocket(token);
                clientSocket2.on("auction_state", (state2) => {
                    expect(state2.currentPrice).toBe(150);
                    expect(state2.status).toBe("active");
                    done();
                });
                clientSocket2.on("connect", () => {
                    clientSocket2.emit("join_auction", { roomId });
                });
            }
        });

        clientSocket.on("connect", () => {
            clientSocket.emit("join_auction", { roomId });
        });
    });
});

describe("Socket.io Auction Events from Scheduler", () => {
    let auctionId: string;
    let roomId: string;

    beforeEach(async () => {
        roomId = `room-event-${Date.now()}`;
        const auction = await Auction.create({
            seller: sellerId,
            title: "Event Test",
            description: "Testing auction events",
            category: "Electronics",
            startingPrice: 100,
            currentPrice: 100,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() + 3600000),
            roomId,
            totalBids: 0,
            participantsCount: 0,
            minimumIncrement: 10,
        });
        auctionId = auction._id.toString();

        await User.create([
            { _id: userId, name: "Bidder", email: "bidder@test.com", password: "hashed123", providers: ["local"] },
            { _id: sellerId, name: "Seller", email: "seller@test.com", password: "hashed123", providers: ["local"] },
        ]);
    });

    afterEach(() => {
        if (clientSocket?.connected) clientSocket.disconnect();
    });

    it("should receive auction_started event", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("auction_started", (data) => {
            expect(data.auction).toBeDefined();
            done();
        });

        clientSocket.on("connect", () => {
            getIO().emit("auction_started", { auction: { _id: auctionId, title: "Event Test" } });
        });
    });

    it("should receive auction_ended event", (done) => {
        const token = makeAccessToken({ _id: userId, userId, name: "Bidder", email: "bidder@test.com", isVerified: true });
        clientSocket = createClientSocket(token);

        clientSocket.on("auction_ended", (data) => {
            expect(data.auction).toBeDefined();
            done();
        });

        clientSocket.on("connect", () => {
            getIO().emit("auction_ended", { auction: { _id: auctionId, title: "Event Test" } });
        });
    });
});
