import api from "../../api/axios";
import { toast } from "sonner";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TJkpAhBuCYO4R3";

export async function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export async function processRazorpayPayment({
    auctionId,
    auctionTitle,
    amount,
    user,
    onSuccess,
}: {
    auctionId: string;
    auctionTitle: string;
    amount: number;
    user?: { name?: string; email?: string } | null;
    onSuccess?: () => void;
}) {
    try {
        // 1. Create payment order on backend
        const { data: orderRes } = await api.post("/payments/create-order", { auctionId });
        const paymentData = orderRes.data?.payment;
        const providerOrderId = paymentData?._id || paymentData?.id;

        // 2. Load Razorpay JS SDK
        const isLoaded = await loadRazorpayScript();

        if (isLoaded && (window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay) {
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: amount * 100,
                currency: "INR",
                name: "Bidding Wars",
                description: `Payment for: ${auctionTitle}`,
                handler: async function (response: {
                    razorpay_payment_id?: string;
                    razorpay_order_id?: string;
                    razorpay_signature?: string;
                }) {
                    try {
                        await api.post("/payments/verify", {
                            providerOrderId: providerOrderId,
                            providerPaymentId: response.razorpay_payment_id || `pay_test_${Date.now()}`,
                            providerSignature: response.razorpay_signature || `sig_test_${Date.now()}`,
                        });
                        toast.success("Payment verified & completed successfully!");
                        if (onSuccess) onSuccess();
                    } catch (err: unknown) {
                        const error = err as { response?: { data?: { message?: string } } };
                        toast.error(error.response?.data?.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#FF3B00",
                },
            };
            const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay;
            const rzp = new RazorpayConstructor(options);
            rzp.open();
        } else {
            // Fallback for dev environment if script fails to load
            toast.info("Processing Razorpay Test Payment...");
            await api.post("/payments/verify", {
                providerOrderId: providerOrderId,
                providerPaymentId: `pay_test_${Date.now()}`,
                providerSignature: `sig_test_${Date.now()}`,
            });
            toast.success("Test payment completed successfully!");
            if (onSuccess) onSuccess();
        }
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "Failed to initiate payment");
    }
}
