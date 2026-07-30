// Importing modules
import AuctionDAO from "../dao/auction.dao.js";
import BidDAO from "../dao/bid.dao.js";
import TimelineDAO from "../dao/timeline.dao.js";
import logger from "../config/logger.config.js";
import socketManager from "./socketManager.js";
import NotFound from "../errors/NotFound.error.js";

const auctionDAO = new AuctionDAO();
const bidDAO = new BidDAO();
const timelineDAO = new TimelineDAO();

// Job 1: Activate upcoming auctions whose startTime has passed
export async function activateUpcomingAuctions() {
    const now = new Date();
    const auctions = await auctionDAO.findUpcomingAuctionsStartingBefore(now);

    if (auctions.length === 0) {
        return { activated: 0, failed: 0 };
    }

    logger.info(`Scheduler: found ${auctions.length} upcoming auctions to activate`);

    let activated = 0;
    let failed = 0;

    const results = await Promise.allSettled(
        auctions.map(async (auction) => {
            try {
                const updated = await auctionDAO.updateStatus(auction._id.toString(), "active");

                await timelineDAO.createEvent({
                    auction: auction._id,
                    user: auction.seller,
                    type: "AUCTION_STARTED",
                    message: "Auction started",
                });

                if(!updated) {
                    throw new NotFound("Auction not found for activation");
                }

                socketManager.emitAuctionStarted(updated.toObject());

                logger.debug({ auctionId: auction._id }, "Scheduler: activated upcoming auction");
                return { auctionId: auction._id, status: "activated" as const };
            } catch (error) {
                logger.error({ auctionId: auction._id, error }, "Scheduler: failed to activate auction");
                return { auctionId: auction._id, status: "failed" as const };
            }
        }),
    );

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.status === "activated") {
            activated++;
        } else {
            failed++;
        }
    }

    logger.info(`Scheduler: activated ${activated} upcoming auctions, ${failed} failed`);
    return { activated, failed };
}

// Job 2: End active auctions whose endTime has passed
export async function endActiveAuctions() {
    const now = new Date();
    const auctions = await auctionDAO.findAuctionsEndingBefore(now);

    if (auctions.length === 0) {
        return { ended: 0, failed: 0 };
    }

    logger.info(`Scheduler: found ${auctions.length} active auctions to end`);

    let ended = 0;
    let failed = 0;

    const results = await Promise.allSettled(
        auctions.map(async (auction) => {
            try {
                const highestBid = await bidDAO.findHighestBidWithTiebreaker(auction._id.toString());

                if (highestBid) {
                    // Update highest bid details on the auction
                    await auctionDAO.updateHighestBid(
                        auction._id.toString(),
                        highestBid.bidder._id.toString(),
                        highestBid.amount,
                    );

                    // End auction with winner
                    await auctionDAO.endAuction(auction._id.toString(), highestBid.bidder._id.toString());

                    // Set payment status to pending (winner must pay)
                    await auctionDAO.updatePaymentStatus(auction._id.toString(), "pending");

                    // Mark the winning bid
                    await bidDAO.markWinningBidByAuction(auction._id.toString());

                    // Create timeline event
                    await timelineDAO.createEvent({
                        auction: auction._id,
                        user: highestBid.bidder._id,
                        type: "AUCTION_ENDED",
                        message: "Auction ended",
                        metadata: {
                            winnerId: highestBid.bidder._id,
                            winningAmount: highestBid.amount,
                        },
                    });

                    // Emit socket event
                    const updatedAuction = await auctionDAO.findAuctionByIdLean(auction._id.toString());
                    if (updatedAuction) {
                        socketManager.emitAuctionEnded(updatedAuction);
                    }

                    logger.debug(
                        { auctionId: auction._id, winner: highestBid.bidder._id, amount: highestBid.amount },
                        "Scheduler: ended auction with winner",
                    );
                } else {
                    // No bids — end auction with no winner
                    await auctionDAO.endAuction(auction._id.toString(), null);

                    // Set payment status to cancelled (no payment needed)
                    await auctionDAO.updatePaymentStatus(auction._id.toString(), "cancelled");

                    // Create timeline event
                    await timelineDAO.createEvent({
                        auction: auction._id,
                        type: "AUCTION_ENDED",
                        message: "Auction ended with no bids",
                        metadata: {
                            winnerId: null,
                            winningAmount: 0,
                        },
                    });

                    // Emit socket event
                    const updatedAuction = await auctionDAO.findAuctionByIdLean(auction._id.toString());
                    if (updatedAuction) {
                        socketManager.emitAuctionEnded(updatedAuction);
                    }

                    logger.debug({ auctionId: auction._id }, "Scheduler: ended auction with no bids");
                }

                return { auctionId: auction._id, status: "ended" as const };
            } catch (error) {
                logger.error({ auctionId: auction._id, error }, "Scheduler: failed to end auction");
                return { auctionId: auction._id, status: "failed" as const };
            }
        }),
    );

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.status === "ended") {
            ended++;
        } else {
            failed++;
        }
    }

    logger.info(`Scheduler: ended ${ended} active auctions, ${failed} failed`);
    return { ended, failed };
}
