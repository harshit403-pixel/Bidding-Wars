import { Router } from "express";

import upload from "../../../shared/middlewares/upload.middleware.js";
import { uploadImage, deleteImage } from "./upload.controller.js";

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

export default uploadRouter;