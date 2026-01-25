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
  ratingDistribution: {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
  };
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: string[];
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  variants: Array<{
    id: number;
    price: number;
    compareAtPrice: number;
    stock: number;
    isActive: boolean;
  }>;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  status: string;
}

export interface StoreOrder {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  discountAmount: number;
  createdAt: string;
  buyer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  location: {
    city: string;
    province: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    total: number;
    variant: {
      id: number;
      size?: string;
      color?: string;
      product: {
        id: number;
        name: string;
        images: string[];
      };
    };
  }>;
  payment?: {
    status: string;
    method: string;
  };
  shipment?: {
    status: string;
    trackingNumber: string;
    courier: string;
  };
  storeItemsTotal: number;
  itemsCount: number;
}

export interface StoreVoucher {
  id: number;
  name: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  expiry: string;
  usageLimit?: number;
  isActive: boolean;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    usages: number;
  };
}

export interface StoreProductsResponse {
  data: StoreProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StoreOrdersResponse {
  data: StoreOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StoreReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    profile?: {
      avatar?: string;
    }
  };
  product: {
    name: string;
    images: string[];
  };
  reply?: string;
}

export interface StoreReviewsResponse {
  data: StoreReview[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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

export const getStoreProducts = async (params?: any): Promise<StoreProductsResponse> => {
  const response = await api.get("/store/products", { params });
  return response.data;
};

export const getStoreOrders = async (params?: any): Promise<StoreOrdersResponse> => {
  const response = await api.get("/store/orders", { params });
  return response.data;
};

export const getStoreVouchers = async (): Promise<StoreVoucher[]> => {
  const response = await api.get("/store/vouchers");
  return response.data;
};

export const getStoreReviews = async (params?: any): Promise<StoreReviewsResponse> => {
  const response = await api.get("/store/reviews", { params });
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

export const createStoreProduct = async (data: any): Promise<StoreProduct> => {
  const response = await api.post("/store/products", data);
  return response.data;
};

export const updateStoreProduct = async (id: number, data: any): Promise<StoreProduct> => {
  const response = await api.patch(`/store/products/${id}`, data);
  return response.data;
};

export const deleteStoreProduct = async (id: number): Promise<void> => {
  await api.delete(`/store/products/${id}`);
};

export const createStoreVoucher = async (data: any): Promise<StoreVoucher> => {
  const response = await api.post("/store/vouchers", data);
  return response.data;
};

export const updateStoreVoucher = async (id: number, data: any): Promise<StoreVoucher> => {
  const response = await api.patch(`/store/vouchers/${id}`, data);
  return response.data;
};

export const deleteStoreVoucher = async (id: number): Promise<void> => {
  await api.delete(`/store/vouchers/${id}`);
};

export const replyToReview = async (id: number, reply: string): Promise<StoreReview> => {
  const response = await api.post(`/store/reviews/${id}/reply`, { reply });
  return response.data;
};

export const deleteStoreReview = async (id: number): Promise<void> => {
  await api.delete(`/store/reviews/${id}`);
};

export const updateOrderStatus = async (id: number, status: string): Promise<StoreOrder> => {
  const response = await api.patch(`/store/orders/${id}/status`, { status });
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
