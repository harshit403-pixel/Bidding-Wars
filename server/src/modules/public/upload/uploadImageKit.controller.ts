// Importing modules
import crypto from "crypto";
import { Request, Response } from "express";
import env from "../../../shared/config/env.config.js";
import Ok from "../../../shared/responses/Ok.response.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";

// generate ImageKit authentication parameters for client-side upload
export const getImageKitAuth = async (req: Request, res: Response) => {
    const { publicKey, privateKey, urlEndpoint } = {
        publicKey: env.IMAGEKIT_PUBLIC_KEY,
        privateKey: env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    };

    if (!privateKey || !publicKey) {
        throw new BadRequest("ImageKit is not configured");
    }

    const token = crypto.randomBytes(10).toString("hex");
    const expiry = Math.floor(Date.now() / 1000) + 600; // 10 minutes

    const signature = crypto
        .createHmac("sha1", privateKey)
        .update(token + expiry)
        .digest("hex");

    return Ok(res, "ImageKit auth params generated", {
        token,
        expiry,
        signature,
        publicKey,
        urlEndpoint,
    });
};
