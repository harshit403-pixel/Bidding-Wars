import { useRef } from "react";
import { ImagePlus, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { UploadedImage } from "../../../pages/CreateAuctionPage";

interface AuctionImagesProps {
    images: UploadedImage[];
    onFilesAdd: (files: File[]) => void;
    onRemove: (index: number) => void;
    disabled: boolean;
}

function AuctionImages({
    images,
    onFilesAdd,
    onRemove,
    disabled,
}: AuctionImagesProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onFilesAdd(files);
        }
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/")
        );
        if (files.length > 0) onFilesAdd(files);
    };

    return (
        <section className="border border-neutral-300 bg-white p-6 sm:p-8">
            <h2
                className="text-3xl uppercase sm:text-5xl"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Images
            </h2>

            {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="group relative aspect-square overflow-hidden border border-neutral-200 bg-neutral-100"
                        >
                            {/* always show local preview */}
                            <img
                                src={img.preview}
                                alt={`Upload ${i + 1}`}
                                className="h-full w-full object-cover"
                            />

                            {/* upload progress overlay */}
                            {img.uploading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    <span className="text-xs font-medium text-white">
                                        {img.progress}%
                                    </span>
                                </div>
                            )}

                            {/* success indicator */}
                            {img.url && !img.uploading && (
                                <div className="absolute right-2 top-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                            )}

                            {/* error indicator */}
                            {img.error && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-500/20">
                                    <AlertCircle className="h-6 w-6 text-red-500" />
                                    <span className="px-2 text-center text-xs text-red-600">
                                        {img.error}
                                    </span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => onRemove(i)}
                                disabled={disabled}
                                className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-40"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <label
                className="mt-6 flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300 transition hover:border-[#FF3B00]"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <ImagePlus size={40} className="text-neutral-400" />
                <p className="mt-3 text-sm text-neutral-500">
                    Drag images here or click to browse
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                    PNG, JPG, WEBP up to 5MB each
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                />
            </label>
        </section>
    );
}

export default AuctionImages;