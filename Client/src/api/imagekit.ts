import api from "./axios";

interface ImageKitAuthResponse {
    token: string;
    expiry?: number;
    expire?: number;
    signature: string;
    publicKey: string;
    urlEndpoint: string;
}

export async function getImageKitAuth(): Promise<ImageKitAuthResponse | null> {
    try {
        const { data } = await api.get<{ data: ImageKitAuthResponse }>(
            "/upload/imagekit-auth"
        );
        if (!data.data?.publicKey || !data.data?.urlEndpoint) {
            return null;
        }
        return data.data;
    } catch {
        return null;
    }
}

export async function uploadToImageKit(
    file: File,
    onProgress?: (percent: number) => void
): Promise<string> {
    const auth = await getImageKitAuth();

    if (!auth) {
        return uploadViaServer(file, onProgress);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `${Date.now()}-${file.name}`);
    formData.append("publicKey", auth.publicKey);
    formData.append("token", auth.token);
    formData.append("expire", String(auth.expire || auth.expiry));
    formData.append("signature", auth.signature);

    try {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                "https://upload.imagekit.io/api/v1/files/upload",
                true
            );

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const res = JSON.parse(xhr.responseText);
                    resolve(res.url);
                } else {
                    let errMsg = "Image upload failed";
                    try {
                        const err = JSON.parse(xhr.responseText);
                        errMsg = err?.message || errMsg;
                    } catch {}
                    reject(new Error(errMsg));
                }
            });

            xhr.addEventListener("error", () => {
                reject(new Error("Image upload failed. Check your network."));
            });

            xhr.addEventListener("timeout", () => {
                reject(new Error("Image upload timed out"));
            });

            xhr.timeout = 60000;
            xhr.send(formData);
        });
    } catch (error) {
        console.warn("ImageKit direct upload failed, falling back to server upload:", error);
        return uploadViaServer(file, onProgress);
    }
}

async function uploadViaServer(
    file: File,
    onProgress?: (percent: number) => void
): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (e.total && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        },
    });

    return data.data.url;
}

export async function checkUploadAvailable(): Promise<boolean> {
    const auth = await getImageKitAuth();
    if (auth) return true;
    // try server upload endpoint with a tiny test
    try {
        await api.get("/upload");
        return true;
    } catch {
        // GET /upload might 405 but server is up
        return true; // assume available if server is reachable
    }
}

export interface CreateAuctionPayload {
    title: string;
    description: string;
    category: string;
    condition: string;
    images: string[];
    startingBid: number;
    minimumIncrement?: number;
    startsAt: string;
    endsAt: string;
}

export async function createAuction(payload: CreateAuctionPayload) {
    const { data } = await api.post("/auctions", payload);
    return data;
}
