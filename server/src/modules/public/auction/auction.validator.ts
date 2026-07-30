// Importing modules
import { param } from "express-validator";
import validateErrors from "../../../shared/utils/validateErrors.util.js";

const auctionIdParamValidators = [

    // validating the auctionId param
    param("auctionId")
        .notEmpty()
        .withMessage("Auction ID is required")
        .isMongoId()
        .withMessage("Auction ID must be a valid MongoDB ObjectId"),

    // validating errors
    validateErrors

];

export { auctionIdParamValidators };
