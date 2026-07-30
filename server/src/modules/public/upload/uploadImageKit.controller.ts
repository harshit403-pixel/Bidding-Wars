import ImageKit from "imagekit";
import { Request, Response } from "express";
import env from "../../../shared/config/env.config.js";
import Ok from "../../../shared/responses/Ok.response.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";

// generate ImageKit authentication parameters for client-side upload
export const getImageKitAuth = async (req: Request, res: Response) => {
    const publicKey = env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
        throw new BadRequest("ImageKit is not configured");
    }

    try {
        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });

        const authParams = imagekit.getAuthenticationParameters();

        return Ok(res, "ImageKit auth params generated", {
            token: authParams.token,
            expire: authParams.expire,
            expiry: authParams.expire,
            signature: authParams.signature,
            publicKey,
            urlEndpoint,
        });
    } catch {
        throw new BadRequest("Failed to generate ImageKit authentication parameters");
    }
};
