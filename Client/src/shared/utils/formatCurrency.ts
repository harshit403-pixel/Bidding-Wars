export function formatCurrency(amount: number): string {
    if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
    if (amount >= 1e12) return `₹${(amount / 1e12).toFixed(1).replace(/\.0$/, "")}T`;
    if (amount >= 1e9) return `₹${(amount / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
    if (amount >= 1e7) return `₹${(amount / 1e7).toFixed(1).replace(/\.0$/, "")}Cr`;
    if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(1).replace(/\.0$/, "")}L`;
    return `₹${amount.toLocaleString()}`;
}
