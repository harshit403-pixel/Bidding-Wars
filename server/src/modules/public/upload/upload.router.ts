import { Router } from "express";

import upload from "../../../shared/middlewares/upload.middleware.js";
import { uploadImage, deleteImage } from "./upload.controller.js";
import { getImageKitAuth } from "./uploadImageKit.controller.js";

const uploadRouter = Router();

uploadRouter.post(
    "/",
    upload.single("image"),
    uploadImage,
);

uploadRouter.delete(
    "/",
    deleteImage,
);

/*
    @route GET /api/upload/imagekit-auth
    @desc Get ImageKit authentication parameters for client-side upload
    @access Public
*/
uploadRouter.get("/imagekit-auth", getImageKitAuth);

export default uploadRouter;