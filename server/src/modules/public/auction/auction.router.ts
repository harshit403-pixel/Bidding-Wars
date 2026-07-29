import { Router } from "express";

import * as AuctionController from "./auction.controller.js";

import authUser from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.get("/", AuctionController.getAuctions);

router.get(
    "/my",
    authUser,
    AuctionController.getMyAuctions,
);

router.get("/:auctionId", AuctionController.getAuction);

router.post(
    "/",
    authUser,
    AuctionController.createAuction,
);

router.patch(
    "/:auctionId",
    authUser,
    AuctionController.updateAuction,
);

router.delete(
    "/:auctionId",
    authUser,
    AuctionController.deleteAuction,
);

export default router;