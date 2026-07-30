// Importing modules
import { Request } from "express";

// Create payment order request body interface
export interface CreatePaymentOrderBody {
    auctionId: string;
}

// Verify payment request body interface
export interface VerifyPaymentBody {
    providerOrderId: string;
    providerPaymentId: string;
    providerSignature: string;
}

// Create payment order request interface
export interface CreatePaymentOrderRequest extends Request {
    body: CreatePaymentOrderBody;
}

// Verify payment request interface
export interface VerifyPaymentRequest extends Request {
    body: VerifyPaymentBody;
}

// Payment params request interface
export interface PaymentParamsRequest extends Request {
    params: {
        auctionId: string;
    };
}
