import { Request } from "express";

export interface UpdateProfileBody {
    name?: string;
    bio?: string;
    avatar?: string;
    phone?: string;
}

export interface UpdateProfileRequest extends Request {
    body: UpdateProfileBody;
}

export interface UserProfileRequest extends Request {
    params: {
        userId: string;
    };
}