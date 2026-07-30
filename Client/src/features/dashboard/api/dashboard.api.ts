import api from "../../api/axios";

export interface DashboardStats {
    activeAuctions: number;
    completedAuctions: number;
    wonAuctions: number;
    myAuctions: number;
    totalBids: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const getDashboard = async () => {
    const { data } = await api.get<ApiResponse<DashboardStats>>("/dashboard");
    return data.data;
};
