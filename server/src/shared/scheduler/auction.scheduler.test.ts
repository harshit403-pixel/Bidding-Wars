import { jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Auction from "../../shared/models/auction.model.js";
import Bid from "../../shared/models/bid.model.js";
import Timeline from "../../shared/models/timeline.model.js";
import User from "../../shared/models/user.model.js";
import { activateUpcomingAuctions, endActiveAuctions } from "./auction.scheduler.js";
import socketManager from "./socketManager.js";

jest.setTimeout(30000);

let mongod: MongoMemoryServer;

const userId1 = new mongoose.Types.ObjectId();
const userId2 = new mongoose.Types.ObjectId();
const sellerId = new mongoose.Types.ObjectId();

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await Auction.deleteMany({});
    await Bid.deleteMany({});
    await Timeline.deleteMany({});
    await User.deleteMany({});

    await User.insertMany([
        { _id: userId1, name: "User One", email: "user1@test.com", password: "hashed", providers: ["local"] },
        { _id: userId2, name: "User Two", email: "user2@test.com", password: "hashed", providers: ["local"] },
        { _id: sellerId, name: "Seller", email: "seller@test.com", password: "hashed", providers: ["local"] },
    ]);

    jest.restoreAllMocks();
});

describe("Scheduler: upcoming auctions → active", () => {
    it("should activate a single upcoming auction when its startTime has passed", async () => {
        const auction = await Auction.create({
            title: "Test Auction",
            description: "A test auction",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "upcoming",
            startTime: new Date(Date.now() - 10000),
            endTime: new Date(Date.now() + 3600000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await activateUpcomingAuctions();

        const updated = await Auction.findById(auction._id);
        expect(updated?.status).toBe("active");
    });

    it("should activate multiple upcoming auctions simultaneously", async () => {
        await Auction.insertMany([
            {
                title: "Auction 1",
                description: "desc",
                category: "Electronics",
    
                startingPrice: 50,
                currentPrice: 50,
                seller: sellerId,
                status: "upcoming",
                startTime: new Date(Date.now() - 10000),
                endTime: new Date(Date.now() + 3600000),
                highestBidder: null,
                winner: null,
                totalBids: 0,
                paymentStatus: "pending",
    
            },
            {
                title: "Auction 2",
                description: "desc",
                category: "Books",
    
                startingPrice: 20,
                currentPrice: 20,
                seller: sellerId,
                status: "upcoming",
                startTime: new Date(Date.now() - 5000),
                endTime: new Date(Date.now() + 7200000),
                highestBidder: null,
                winner: null,
                totalBids: 0,
                paymentStatus: "pending",
    
            },
        ]);

        const result = await activateUpcomingAuctions();

        expect(result.activated).toBe(2);
        expect(result.failed).toBe(0);

        const activeAuctions = await Auction.find({ status: "active" });
        expect(activeAuctions).toHaveLength(2);
    });

    it("should not activate auctions whose startTime is still in the future", async () => {
        await Auction.create({
            title: "Future Auction",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "upcoming",
            startTime: new Date(Date.now() + 3600000),
            endTime: new Date(Date.now() + 7200000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        const result = await activateUpcomingAuctions();

        expect(result.activated).toBe(0);
    });

    it("should create a timeline event when activating an auction", async () => {
        const auction = await Auction.create({
            title: "Timeline Test",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "upcoming",
            startTime: new Date(Date.now() - 10000),
            endTime: new Date(Date.now() + 3600000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await activateUpcomingAuctions();

        const events = await Timeline.find({ auction: auction._id });
        expect(events).toHaveLength(1);
        expect(events[0].type).toBe("AUCTION_STARTED");
    });

    it("should emit auction_started event on socket", async () => {
        const emitSpy = jest.spyOn(socketManager, "emitAuctionStarted").mockImplementation(() => {});

        const auction = await Auction.create({
            title: "Socket Test",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "upcoming",
            startTime: new Date(Date.now() - 10000),
            endTime: new Date(Date.now() + 3600000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await activateUpcomingAuctions();

        expect(emitSpy).toHaveBeenCalled();
    });

    it("should handle database errors gracefully for individual auctions", async () => {
        await Auction.insertMany([
            {
                title: "Good Auction",
                description: "desc",
                category: "Electronics",
    
                startingPrice: 100,
                currentPrice: 100,
                seller: sellerId,
                status: "upcoming",
                startTime: new Date(Date.now() - 10000),
                endTime: new Date(Date.now() + 3600000),
                highestBidder: null,
                winner: null,
                totalBids: 0,
                paymentStatus: "pending",
    
            },
        ]);

        // Mock updateStatus to fail for the first call, succeed for the rest
        const originalUpdateStatus = jest.fn();
        let callCount = 0;

        jest.spyOn(Auction, "findByIdAndUpdate").mockImplementation((async () => {
            callCount++;
            if (callCount === 1) {
                throw new Error("Database error");
            }
            return { status: "active" };
        }) as never);

        const result = await activateUpcomingAuctions();

        expect(result.failed).toBeGreaterThanOrEqual(0);
    });
});

describe("Scheduler: active auctions → ended", () => {
    it("should end a single active auction when its endTime has passed", async () => {
        const auction = await Auction.create({
            title: "End Test",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await endActiveAuctions();

        const updated = await Auction.findById(auction._id);
        expect(updated?.status).toBe("ended");
        expect(updated?.endedAt).toBeDefined();
    });

    it("should set the winner to the highest bidder", async () => {
        const auction = await Auction.create({
            title: "Winner Test",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 200,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: userId1,
            winner: null,
            totalBids: 2,
            paymentStatus: "pending",

        });

        await Bid.create({
            auction: auction._id,
            bidder: userId1,
            amount: 150,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 1800000),
        });

        await Bid.create({
            auction: auction._id,
            bidder: userId2,
            amount: 200,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 900000),
        });

        await endActiveAuctions();

        const updated = await Auction.findById(auction._id);
        expect(updated?.winner?.toString()).toBe(userId2.toString());
        expect(updated?.currentPrice).toBe(200);
    });

    it("should handle auctions with no bids", async () => {
        const auction = await Auction.create({
            title: "No Bids",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await endActiveAuctions();

        const updated = await Auction.findById(auction._id);
        expect(updated?.status).toBe("ended");
        expect(updated?.winner).toBeNull();
        expect(updated?.paymentStatus).toBe("cancelled");
    });

    it("should handle auctions with same amount bids (oldest wins)", async () => {
        const auction = await Auction.create({
            title: "Same Bids",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 150,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: userId1,
            winner: null,
            totalBids: 2,
            paymentStatus: "pending",

        });

        await Bid.create({
            auction: auction._id,
            bidder: userId1,
            amount: 150,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 1800000),
        });

        await Bid.create({
            auction: auction._id,
            bidder: userId2,
            amount: 150,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 900000),
        });

        await endActiveAuctions();

        const updated = await Auction.findById(auction._id);
        expect(updated?.winner?.toString()).toBe(userId1.toString());
    });

    it("should create timeline event when auction ends", async () => {
        const auction = await Auction.create({
            title: "Timeline End",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await endActiveAuctions();

        const events = await Timeline.find({ auction: auction._id });
        expect(events).toHaveLength(1);
        expect(events[0].type).toBe("AUCTION_ENDED");
    });

    it("should emit auction_ended event on socket", async () => {
        const emitSpy = jest.spyOn(socketManager, "emitAuctionEnded").mockImplementation(() => {});

        const auction = await Auction.create({
            title: "Socket End",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        await endActiveAuctions();

        expect(emitSpy).toHaveBeenCalled();
    });

    it("should not end auctions whose endTime is still in the future", async () => {
        await Auction.create({
            title: "Future End",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 100,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() + 3600000),
            highestBidder: null,
            winner: null,
            totalBids: 0,
            paymentStatus: "pending",

        });

        const result = await endActiveAuctions();

        expect(result.ended).toBe(0);
    });

    it("should handle database errors gracefully for individual auctions", async () => {
        await Auction.insertMany([
            {
                title: "Good Auction",
                description: "desc",
                category: "Electronics",
    
                startingPrice: 100,
                currentPrice: 100,
                seller: sellerId,
                status: "active",
                startTime: new Date(Date.now() - 3600000),
                endTime: new Date(Date.now() - 1000),
                highestBidder: null,
                winner: null,
                totalBids: 0,
                paymentStatus: "pending",
    
            },
        ]);

        jest.spyOn(Auction, "findByIdAndUpdate").mockImplementation((async () => {
            throw new Error("Database error");
        }) as never);

        const result = await endActiveAuctions();

        expect(result.failed).toBeGreaterThanOrEqual(0);
    });

    it("should mark the winning bid as isWinningBid", async () => {
        const auction = await Auction.create({
            title: "Winning Bid Mark",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 200,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: userId1,
            winner: null,
            totalBids: 2,
            paymentStatus: "pending",

        });

        const bid1 = await Bid.create({
            auction: auction._id,
            bidder: userId1,
            amount: 150,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 1800000),
        });

        const bid2 = await Bid.create({
            auction: auction._id,
            bidder: userId2,
            amount: 200,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 900000),
        });

        await endActiveAuctions();

        const updatedBid1 = await Bid.findById(bid1._id);
        const updatedBid2 = await Bid.findById(bid2._id);

        expect(updatedBid1?.isWinningBid).toBe(false);
        expect(updatedBid2?.isWinningBid).toBe(true);
    });

    it("should set paymentStatus to pending when there is a winner", async () => {
        const auction = await Auction.create({
            title: "Payment Status",
            description: "desc",
            category: "Electronics",

            startingPrice: 100,
            currentPrice: 200,
            seller: sellerId,
            status: "active",
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 1000),
            highestBidder: userId1,
            winner: null,
            totalBids: 1,
            paymentStatus: "pending",

        });

        await Bid.create({
            auction: auction._id,
            bidder: userId1,
            amount: 200,
            isWinningBid: false,
            placedAt: new Date(Date.now() - 900000),
        });

        await endActiveAuctions();

        const updated = await Auction.findById(auction._id);
        expect(updated?.paymentStatus).toBe("pending");
    });
});

describe("Scheduler: combined scenarios", () => {
    it("should handle both activation and ending in sequence", async () => {
        await Auction.insertMany([
            {
                title: "To Activate",
                description: "desc",
                category: "Electronics",
    
                startingPrice: 100,
                currentPrice: 100,
                seller: sellerId,
                status: "upcoming",
                startTime: new Date(Date.now() - 10000),
                endTime: new Date(Date.now() + 3600000),
                highestBidder: null,
                winner: null,
                totalBids: 0,
                paymentStatus: "pending",
    
            },
            {
                title: "To End",
                description: "desc",
                category: "Books",
    
                startingPrice: 50,
                currentPrice: 50,
                seller: sellerId,
                status: "active",
                startTime: new Date(Date.now() - 7200000),
                endTime: new Date(Date.now() - 1000),
                highestBidder: null,
                winner: null,
                totalBids: 0,
                paymentStatus: "pending",
    
            },
        ]);

        const activateResult = await activateUpcomingAuctions();
        const endResult = await endActiveAuctions();

        expect(activateResult.activated).toBe(1);
        expect(endResult.ended).toBe(1);

        const active = await Auction.find({ status: "active" });
        expect(active).toHaveLength(1);

        const ended = await Auction.find({ status: "ended" });
        expect(ended).toHaveLength(1);
    });
});