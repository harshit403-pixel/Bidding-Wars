import { Router } from "express";

import * as ProfileController from "./profile.controller.js";

import authUser from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/me",
    authUser,
    ProfileController.getMyProfile,
);

router.patch(
    "/me",
    authUser,
    ProfileController.updateProfile,
);

router.get(
    "/:userId",
    ProfileController.getUserProfile,
);

export default router;