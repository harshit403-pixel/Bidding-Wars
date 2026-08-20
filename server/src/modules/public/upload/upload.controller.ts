import { Request, Response, NextFunction } from "express";
import ImageKit from "imagekit";

import Ok from "../../../shared/responses/Ok.response.js";
import env from "../../../shared/config/env.config.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) {
            throw new BadRequest("No image uploaded.");
        }

        const publicKey = env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT;

        if (!publicKey || !privateKey || !urlEndpoint) {
            throw new BadRequest("ImageKit is not configured on the server.");
        }

        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });

        const file = req.file;

        const result = await imagekit.upload({
            file: file.buffer,
            fileName: `${Date.now()}-${file.originalname || "image.png"}`,
            folder: "/bidarena",
        });

        return Ok(res, "Image uploaded successfully.", {
            url: result.url,
            fileId: result.fileId,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const fileId = String(req.params.publicId || req.params.fileId);

        const publicKey = env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT;

        if (publicKey && privateKey && urlEndpoint) {
            const imagekit = new ImageKit({
                publicKey,
                privateKey,
                urlEndpoint,
            });
            await imagekit.deleteFile(fileId);
        }

        return Ok(res, "Image deleted successfully.");
    } catch (error) {
        next(error);
    }
};