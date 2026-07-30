import { useState } from "react";

const images = [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=1200",
    "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=1200",
];

function AuctionGallery() {
    const [selected, setSelected] = useState(images[0]);

    return (
        <div>
            <div className="overflow-hidden border border-neutral-300 bg-white">
                <img
                    src={selected}
                    alt="Auction Item"
                    className="aspect-square w-full object-cover"
                />
            </div>

            <div className="mt-5 grid grid-cols-4 gap-4">
                {images.map((image) => (
                    <button
                        key={image}
                        onClick={() => setSelected(image)}
                        className={`overflow-hidden border transition ${
                            selected === image
                                ? "border-black"
                                : "border-neutral-300"
                        }`}
                    >
                        <img
                            src={image}
                            alt=""
                            className="aspect-square w-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AuctionGallery;