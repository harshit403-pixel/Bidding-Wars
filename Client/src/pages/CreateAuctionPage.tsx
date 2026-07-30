import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import AuctionForm from "../shared/components/create-auction/AuctionForm";
import AuctionImages from "../shared/components/create-auction/AuctionImages";
import PreviewCard from "../shared/components/create-auction/PreviewCard";
import {
    createAuction,
    uploadToImageKit,
} from "../api/imagekit";

export interface AuctionFormData {
    title: string;
    description: string;
    category: string;
    condition: string;
    startingBid: string;
    minimumIncrement: string;
    startsAt: string;
    endsAt: string;
}

export interface UploadedImage {
    file: File;
    url: string | null;
    preview: string;
    progress: number;
    uploading: boolean;
    error: string | null;
}

const initialFormData: AuctionFormData = {
    title: "",
    description: "",
    category: "",
    condition: "",
    startingBid: "",
    minimumIncrement: "",
    startsAt: "",
    endsAt: "",
};

function CreateAuctionPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<AuctionFormData>(initialFormData);
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, []);

    const updateField = useCallback(
        (field: keyof AuctionFormData, value: string) => {
            setForm((prev) => {
                const next = { ...prev, [field]: value };
                if (field === "startsAt" && value && !prev.endsAt) {
                    const start = new Date(value);
                    start.setHours(start.getHours() + 1);
                    next.endsAt = start.toISOString().slice(0, 16);
                }
                return next;
            });
        },
        []
    );

    const handleFilesAdd = useCallback(
        (files: File[]) => {
            const startIndex = images.length;
            const newImages: UploadedImage[] = files.map((file) => ({
                file,
                url: null,
                preview: URL.createObjectURL(file),
                progress: 0,
                uploading: false,
                error: null,
            }));
            setImages((prev) => [...prev, ...newImages]);

            // start uploading each image immediately
            files.forEach((_, i) => {
                const index = startIndex + i;
                // need to use setTimeout so state is updated before upload reads images
                setTimeout(() => {
                    // trigger upload by calling the upload function directly
                    (async () => {
                        const file = files[i];
                        const uploadIndex = index;

                        setImages((prev) =>
                            prev.map((item, j) =>
                                j === uploadIndex
                                    ? { ...item, uploading: true, error: null }
                                    : item
                            )
                        );

                        try {
                            const url = await uploadToImageKit(file, (progress) => {
                                setImages((prev) =>
                                    prev.map((item, j) =>
                                        j === uploadIndex
                                            ? { ...item, progress }
                                            : item
                                    )
                                );
                            });
                            setImages((prev) =>
                                prev.map((item, j) =>
                                    j === uploadIndex
                                        ? { ...item, url, progress: 100, uploading: false }
                                        : item
                                )
                            );
                        } catch (err: unknown) {
                            const message =
                                err instanceof Error ? err.message : "Upload failed";
                            setImages((prev) =>
                                prev.map((item, j) =>
                                    j === uploadIndex
                                        ? { ...item, uploading: false, error: message }
                                        : item
                                )
                            );
                            toast.error(`Image upload failed: ${message}`);
                        }
                    })();
                }, 0);
            });
        },
        [images.length]
    );

    const handleImageRemove = useCallback((index: number) => {
        setImages((prev) => {
            const img = prev[index];
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (form.title.trim().length < 5) {
            toast.error("Title must be at least 5 characters");
            return;
        }
        if (!form.description.trim()) {
            toast.error("Description is required");
            return;
        }
        if (form.description.trim().length < 20) {
            toast.error("Description must be at least 20 characters");
            return;
        }
        if (!form.category) {
            toast.error("Select a category");
            return;
        }
        if (!form.condition) {
            toast.error("Select item condition");
            return;
        }
        if (!form.startingBid || Number(form.startingBid) <= 0) {
            toast.error("Starting bid must be greater than 0");
            return;
        }
        if (!form.startsAt) {
            toast.error("Start time is required");
            return;
        }
        if (new Date(form.startsAt) < new Date()) {
            toast.error("Start time cannot be in the past");
            return;
        }
        if (!form.endsAt) {
            toast.error("End time is required");
            return;
        }
        if (new Date(form.endsAt) <= new Date(form.startsAt)) {
            toast.error("End time must be after start time");
            return;
        }

        // wait for any in-progress uploads
        const uploading = images.some((img) => img.uploading);
        if (uploading) {
            toast.error("Wait for images to finish uploading");
            return;
        }

        const uploadedUrls = images
            .map((img) => img.url)
            .filter((url): url is string => url !== null);

        if (uploadedUrls.length === 0) {
            toast.error("Upload at least one image");
            return;
        }

        // check for failed uploads
        const failed = images.filter((img) => img.error);
        if (failed.length > 0) {
            toast.error("Some images failed to upload. Remove them and try again.");
            return;
        }

        setSubmitting(true);
        try {
            await createAuction({
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                condition: form.condition,
                images: uploadedUrls,
                startingBid: Number(form.startingBid),
                minimumIncrement: form.minimumIncrement
                    ? Number(form.minimumIncrement)
                    : undefined,
                startsAt: new Date(form.startsAt).toISOString(),
                endsAt: new Date(form.endsAt).toISOString(),
            });

            toast.success("Auction created successfully!");
            navigate("/dashboard");
        } catch (error: unknown) {
            const err = error as {
                response?: { data?: { message?: string } };
            };
            toast.error(
                err.response?.data?.message || "Failed to create auction"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F5F1EB]">
            <section className="border-b border-neutral-300">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8">
                    <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                        Seller Dashboard
                    </p>
                    <h1
                        className="mt-3 uppercase leading-none"
                        style={{
                            fontFamily: "Bebas Neue",
                            fontSize: "clamp(3rem,10vw,8rem)",
                        }}
                    >
                        Create
                        <br />
                        Auction
                    </h1>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
                <div className="min-w-0 space-y-8 sm:space-y-12">
                    <AuctionImages
                        images={images}
                        onFilesAdd={handleFilesAdd}
                        onRemove={handleImageRemove}
                        disabled={submitting}
                    />
                    <AuctionForm
                        form={form}
                        onUpdateField={updateField}
                    />
                </div>
                <PreviewCard
                    form={form}
                    images={images}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            </section>
        </main>
    );
}

export default CreateAuctionPage;