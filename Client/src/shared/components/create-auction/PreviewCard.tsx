import { Loader2 } from "lucide-react";
import type { AuctionFormData, UploadedImage } from "../../../pages/CreateAuctionPage";

interface PreviewCardProps {
    form: AuctionFormData;
    images: UploadedImage[];
    onSubmit: () => void;
    submitting: boolean;
}

function PreviewCard({
    form,
    images,
    onSubmit,
    submitting,
}: PreviewCardProps) {
    const firstImage = images[0]?.url || images[0]?.preview;
    const uploadedCount = images.filter((i) => i.url).length;

    return (
        <aside className="sticky top-8 h-fit w-full min-w-0 overflow-hidden border border-neutral-300 bg-white p-6 sm:p-8">
            <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                Live Preview
            </p>

            <div className="mt-6 aspect-square overflow-hidden border border-neutral-200 bg-neutral-100 sm:mt-8">
                {firstImage ? (
                    <img
                        src={firstImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        No image
                    </div>
                )}
            </div>

            <h2
                className="mt-6 w-full min-w-0 truncate text-3xl uppercase sm:mt-8 sm:text-4xl"
                title={form.title || "Auction Title"}
                style={{ fontFamily: "Bebas Neue" }}
            >
                {form.title || "Auction Title"}
            </h2>

            {form.category && (
                <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">
                    {form.category}
                </p>
            )}

            {form.startingBid && (
                <p className="mt-3 text-lg font-bold text-[#FF3B00]">
                    ${Number(form.startingBid).toLocaleString()}
                </p>
            )}

            <p className="mt-3 w-full min-w-0 whitespace-pre-wrap break-words text-sm text-neutral-500 line-clamp-6">
                {form.description ||
                    "Your auction preview will update as you fill the form."}
            </p>

            <div className="mt-4 flex gap-4 text-xs text-neutral-400">
                {form.condition && <span>{form.condition}</span>}
                {uploadedCount > 0 && (
                    <span>
                        {uploadedCount} image{uploadedCount !== 1 ? "s" : ""}
                    </span>
                )}
                {form.startsAt && form.endsAt && (
                    <span>
                        {new Date(form.startsAt).toLocaleDateString()} –{" "}
                        {new Date(form.endsAt).toLocaleDateString()}
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="mt-8 flex w-full items-center justify-center gap-2 border-b-2 border-[#FF3B00] bg-[#FF3B00] py-4 text-white transition hover:bg-[#FF5A2C] disabled:opacity-50 disabled:cursor-not-allowed sm:mt-10"
                style={{ fontFamily: "Bebas Neue" }}
            >
                {submitting ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Publishing...
                    </>
                ) : (
                    "Publish Auction"
                )}
            </button>
        </aside>
    );
}

export default PreviewCard;