// Importing modules
import Payment from "../models/payment.model.js";

// Class to handle all payment data access operations
class PaymentDAO {

    PaymentModel: typeof Payment;

    constructor() {
        this.PaymentModel = Payment;
    }

    // Create a new payment record
    async createPayment(data: Record<string, unknown>) {
        return await this.PaymentModel.create(data);
    }

    // Find payment by ID
    async findPaymentById(paymentId: string) {
        return await this.PaymentModel.findById(paymentId)
            .populate("auction", "title currentPrice status")
            .populate("winner", "name email avatar")
            .lean();
    }

    // Find payment by auction ID
    async findPaymentByAuction(auctionId: string) {
        return await this.PaymentModel.findOne({ auction: auctionId })
            .populate("auction", "title currentPrice status seller")
            .populate("winner", "name email avatar")
            .lean();
    }

    // Find payment by provider order ID (used during webhook verification)
    async findPaymentByProviderOrderId(providerOrderId: string) {
        return await this.PaymentModel.findOne({ providerOrderId }).lean();
    }

    // Find all payments for a specific user (winner)
    async findPaymentsByUser(
        userId: string,
        options: { page?: number; limit?: number } = {},
    ) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const filter = { winner: userId };

        const [payments, total] = await Promise.all([
            this.PaymentModel.find(filter)
                .populate("auction", "title currentPrice")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.PaymentModel.countDocuments(filter),
        ]);

        return { payments, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // Update payment after successful provider verification
    async updatePaymentVerification(
        providerOrderId: string,
        data: {
            providerPaymentId: string;
            providerSignature: string;
            status: string;
            paidAt?: Date;
        },
    ) {
        return await this.PaymentModel.findOneAndUpdate(
            { providerOrderId },
            data,
            { new: true, runValidators: true },
        );
    }

    // Update payment status by ID
    async updatePaymentStatus(paymentId: string, status: string) {
        return await this.PaymentModel.findByIdAndUpdate(
            paymentId,
            { status },
            { new: true, runValidators: true },
        );
    }

    // Update payment status by auction ID
    async updatePaymentStatusByAuction(auctionId: string, status: string) {
        return await this.PaymentModel.findOneAndUpdate(
            { auction: auctionId },
            { status },
            { new: true, runValidators: true },
        );
    }

    // Check if a payment already exists for an auction (prevent duplicate orders)
    async paymentExistsForAuction(auctionId: string) {
        const payment = await this.PaymentModel.findOne({ auction: auctionId }).lean();
        return !!payment;
    }
}

export default PaymentDAO;
