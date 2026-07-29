import { z } from "zod";

const auctionSchema = z.object({
    title: z.string().trim().min(5).max(100),

    description: z.string().trim().min(20).max(2000),

    category: z.enum([
        "Electronics",
        "Fashion",
        "Home",
        "Books",
        "Sports",
        "Vehicles",
        "Collectibles",
        "Others",
    ]),

    condition: z.enum([
        "New",
        "Like New",
        "Good",
        "Fair",
        "Poor",
    ]),

    images: z.array(z.string().url()).min(1),

    startingBid: z.number().positive(),

    minimumIncrement: z.number().positive().optional(),

    startsAt: z.coerce.date(),

    endsAt: z.coerce.date(),
});

export const createAuctionSchema = auctionSchema.refine(
    (data) => data.endsAt > data.startsAt,
    {
        message: "End date must be after start date",
        path: ["endsAt"],
    }
);

export const updateAuctionSchema = auctionSchema.partial();