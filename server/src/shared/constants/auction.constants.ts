export const AUCTION_STATUS = {
    DRAFT: "draft",
    UPCOMING: "upcoming",
    ACTIVE: "active",
    ENDED: "ended",
    CANCELLED: "cancelled",
} as const;

export const AUCTION_CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home",
    "Books",
    "Sports",
    "Vehicles",
    "Collectibles",
    "Others",
] as const;

export const ITEM_CONDITIONS = [
    "New",
    "Like New",
    "Good",
    "Fair",
    "Poor",
] as const;

export const DEFAULT_MINIMUM_INCREMENT = 10;

export const DEFAULT_AUCTION_DURATION_HOURS = 24;