function PreviewCard() {
    return (
        <aside className="sticky top-8 h-fit border border-neutral-300 bg-white p-8">

            <p className="uppercase tracking-[0.35em] text-[#FF3B00]">
                Live Preview
            </p>

            <div className="mt-8 aspect-square bg-neutral-200" />

            <h2 className="mt-8 text-4xl font-bold">
                Rolex Submariner
            </h2>

            <p className="mt-4 text-neutral-600">
                Your auction preview will update as you fill the form.
            </p>

            <button className="mt-10 w-full bg-black py-4 text-white transition hover:bg-[#FF3B00]">
                Publish Auction
            </button>

        </aside>
    );
}

export default PreviewCard;