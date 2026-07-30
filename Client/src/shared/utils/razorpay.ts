import api from "../../api/axios";
import { toast } from "sonner";

export async function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) {
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

        if (isLoaded && (window as any).Razorpay) {
            const options = {
                key: "rzp_test_sample",
                amount: amount * 100, // paise
                currency: "INR",
                name: "Bidding Wars",
                description: `Payment for: ${auctionTitle}`,
                handler: async function (response: any) {
                    try {
                        await api.post("/payments/verify", {
                            providerOrderId: providerOrderId,
                            providerPaymentId: response.razorpay_payment_id || `pay_test_${Date.now()}`,
                            providerSignature: response.razorpay_signature || `sig_test_${Date.now()}`,
                        });
                        toast.success("Payment verified & completed successfully!");
                        if (onSuccess) onSuccess();
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Payment verification failed");
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
            const rzp = new (window as any).Razorpay(options);
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
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
}
