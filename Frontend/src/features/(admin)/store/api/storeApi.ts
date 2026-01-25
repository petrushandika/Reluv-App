import { api } from "@/shared/lib/axios";

export interface Store {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  locationId?: number;
  userId: number;
  profile?: {
    avatar?: string;
    banner?: string;
    bio?: string;
    operational?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStoreDto {
  name?: string;
  slug?: string;
  isActive?: boolean;
  locationId?: number;
}

export interface UpdateStoreProfileDto {
  avatar?: string;
  banner?: string;
  bio?: string;
  operational?: string;
}

export interface DashboardAnalytics {
  store: Store;
  stats: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    outOfStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    shippedOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    todayRevenue: number;
    totalReviews: number;
    averageRating: number;
    unrepliedReviews: number;
    totalVouchers: number;
    activeVouchers: number;
    totalDiscounts: number;
    activeDiscounts: number;
    totalPromotions: number;
    activePromotions: number;
  };
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    buyer: {
      firstName: string;
      lastName: string;
      email: string;
    };
    createdAt: string;
  }>;
  recentReviews: Array<{
    id: number;
    rating: number;
    comment: string;
    productName: string;
    authorName: string;
    hasReply: boolean;
    createdAt: string;
  }>;
  charts: {
    monthlyRevenue: Array<{ name: string; total: number }>;
    weeklyRevenue: Array<{ name: string; total: number }>;
  };
}

export const getMyStore = async (): Promise<Store> => {
  const response = await api.get("/store/me/my-store");
  return response.data;
};

export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  const response = await api.get("/store/analytics");
  return response.data;
};

export const updateStore = async (data: UpdateStoreDto): Promise<Store> => {
  const response = await api.patch("/store/me/my-store", data);
  return response.data;
};

export const updateStoreProfile = async (data: UpdateStoreProfileDto): Promise<Store> => {
  const response = await api.patch("/store/me/my-store/profile", data);
  return response.data;
};

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
