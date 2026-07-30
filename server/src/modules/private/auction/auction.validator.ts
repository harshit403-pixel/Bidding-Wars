// Importing modules
import { body } from "express-validator";
import validateErrors from "../../../shared/utils/validateErrors.util.js";

const createAuctionValidators = [

    // validating the title field
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),

    // validating the description field
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20, max: 2000 })
        .withMessage("Description must be between 20 and 2000 characters"),

    // validating the category field
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn([
            "Electronics",
            "Fashion",
            "Home",
            "Books",
            "Sports",
            "Vehicles",
            "Collectibles",
            "Others",
        ])
        .withMessage("Category must be one of: Electronics, Fashion, Home, Books, Sports, Vehicles, Collectibles, Others"),

    // validating the condition field
    body("condition")
        .notEmpty()
        .withMessage("Condition is required")
        .isIn([
            "New",
            "Like New",
            "Good",
            "Fair",
            "Poor",
        ])
        .withMessage("Condition must be one of: New, Like New, Good, Fair, Poor"),

    // validating the images field
    body("images")
        .isArray({ min: 1 })
        .withMessage("At least one image is required"),

    body("images.*")
        .isURL()
        .withMessage("Each image must be a valid URL"),

    // validating the startingBid field
    body("startingBid")
        .notEmpty()
        .withMessage("Starting bid is required")
        .isFloat({ gt: 0 })
        .withMessage("Starting bid must be greater than 0"),

    // validating the minimumIncrement field
    body("minimumIncrement")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Minimum increment must be greater than 0"),

    // validating the startsAt field
    body("startsAt")
        .notEmpty()
        .withMessage("Start time is required")
        .isISO8601()
        .withMessage("Start time must be a valid date"),

    // validating the endsAt field
    body("endsAt")
        .notEmpty()
        .withMessage("End time is required")
        .isISO8601()
        .withMessage("End time must be a valid date"),

    // validating errors
    validateErrors

];

const updateAuctionValidators = [

    // validating the title field
    body("title")
        .optional()
        .isLength({ min: 5, max: 100 })
        .withMessage("Title must be between 5 and 100 characters"),

    // validating the description field
    body("description")
        .optional()
        .isLength({ min: 20, max: 2000 })
        .withMessage("Description must be between 20 and 2000 characters"),

    // validating the category field
    body("category")
        .optional()
        .isIn([
            "Electronics",
            "Fashion",
            "Home",
            "Books",
            "Sports",
            "Vehicles",
            "Collectibles",
            "Others",
        ])
        .withMessage("Category must be one of: Electronics, Fashion, Home, Books, Sports, Vehicles, Collectibles, Others"),

    // validating the condition field
    body("condition")
        .optional()
        .isIn([
            "New",
            "Like New",
            "Good",
            "Fair",
            "Poor",
        ])
        .withMessage("Condition must be one of: New, Like New, Good, Fair, Poor"),

    // validating the images field
    body("images")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one image is required"),

    body("images.*")
        .optional()
        .isURL()
        .withMessage("Each image must be a valid URL"),

    // validating the startingBid field
    body("startingBid")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Starting bid must be greater than 0"),

    // validating the minimumIncrement field
    body("minimumIncrement")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Minimum increment must be greater than 0"),

    // validating the startsAt field
    body("startsAt")
        .optional()
        .isISO8601()
        .withMessage("Start time must be a valid date"),

    // validating the endsAt field
    body("endsAt")
        .optional()
        .isISO8601()
        .withMessage("End time must be a valid date"),

    // validating errors
    validateErrors

];

export { createAuctionValidators, updateAuctionValidators };
