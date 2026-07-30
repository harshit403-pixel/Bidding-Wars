import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";

import cloudinary from "../../../shared/config/cloudinary.config.js";
import Ok from "../../../shared/responses/Ok.response.js";
import env from "../../../shared/config/env.config.js";

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.file) {
            throw new Error("No image uploaded.");
        }

        if (!env.CLOUDINARY_CLOUD_NAME) {
            throw new Error("Cloudinary is not configured. Use ImageKit client-side upload instead.");
        }

        const file = req.file;

        const result = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "bidarena",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        });

        return Ok(res, "Image uploaded successfully.", {
            url: result.secure_url,
            publicId: result.public_id,
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
        const publicId = String(req.params.publicId);

await cloudinary.uploader.destroy(publicId);

       

        return Ok(res, "Image deleted successfully.");
    } catch (error) {
        next(error);
    }
};