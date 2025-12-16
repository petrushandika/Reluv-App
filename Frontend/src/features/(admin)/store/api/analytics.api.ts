import { api } from "@/shared/lib/axios";

export interface StoreAnalytics {
  store: {
    id: number;
    name: string;
    slug: string;
  };
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    thisMonthRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
  alerts: {
    lowStockProducts: any[];
    pendingOrders: any[];
    unrepliedReviews: any[];
  };
  recentOrders: any[];
  recentReviews: any[];
}

export const getAnalytics = async (): Promise<StoreAnalytics> => {
  try {
    const response = await api.get("/stores/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};
