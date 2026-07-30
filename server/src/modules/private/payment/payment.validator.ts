// Importing modules
import { body } from "express-validator";
import validateErrors from "../../../shared/utils/validateErrors.util.js";

const createOrderValidators = [

    // validating the auctionId field
    body("auctionId")
        .notEmpty()
        .withMessage("Auction ID is required")
        .isMongoId()
        .withMessage("Auction ID must be a valid MongoDB ObjectId"),

    // validating errors
    validateErrors

];

const verifyPaymentValidators = [

    // validating the providerOrderId field
    body("providerOrderId")
        .notEmpty()
        .withMessage("Provider order ID is required"),

    // validating the providerPaymentId field
    body("providerPaymentId")
        .notEmpty()
        .withMessage("Provider payment ID is required"),

    // validating the providerSignature field
    body("providerSignature")
        .notEmpty()
        .withMessage("Provider signature is required"),

    // validating errors
    validateErrors

];

export { createOrderValidators, verifyPaymentValidators };
