import { ImagePlus } from "lucide-react";

function AuctionImages() {
    return (
        <section className="border border-neutral-300 bg-white p-8">

            <h2
                className="text-5xl uppercase"
                style={{ fontFamily: "Bebas Neue" }}
            >
                Images
            </h2>

            <label className="mt-8 flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300">

                <ImagePlus size={48} />

                <p className="mt-4">
                    Upload auction images
                </p>

                <input
                    type="file"
                    multiple
                    className="hidden"
                />

            </label>

        </section>
    );
}

export default AuctionImages;