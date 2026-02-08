import { api } from "@/shared/lib/axios";

export interface StoreListItem {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  isVerified: boolean;
  totalProducts: number;
  totalSales: number;
  rating: number | null;
  createdAt: string;
  profile?: {
    avatar?: string;
    banner?: string;
  };
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface StoresResponse {
  data: StoreListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryStoresParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export const getStores = async (
  params?: QueryStoresParams
): Promise<StoresResponse> => {
  const response = await api.get<StoresResponse>("/store", { params });
  return response.data;
};

export const updateStoreStatus = async (
  storeId: number,
  data: { isActive?: boolean; isVerified?: boolean }
): Promise<StoreListItem> => {
  const response = await api.patch<StoreListItem>(`/store/admin/${storeId}`, data);
  return response.data;
};

export interface UserListItem {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: "USER" | "ADMIN" | "STORE";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  profile?: {
    avatar?: string;
  };
  store?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface UsersResponse {
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "USER" | "ADMIN" | "STORE";
  isActive?: boolean;
  isVerified?: boolean;
}

export const getUsers = async (
  params?: QueryUsersParams
): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>("/users/admin", { params });
  return response.data;
};

export const updateUserStatus = async (
  userId: number,
  data: { isActive?: boolean; isVerified?: boolean; role?: "USER" | "ADMIN" | "STORE" }
): Promise<UserListItem> => {
  const response = await api.patch<UserListItem>(`/users/admin/${userId}`, data);
  return response.data;
};

export interface CategoryListItem {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  parentCategory?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  childCategories?: CategoryListItem[];
  _count?: {
    products: number;
    childCategories: number;
  };
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  parentId?: number | null;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  parentId?: number | null;
}

export const getCategories = async (): Promise<CategoryListItem[]> => {
  const response = await api.get<CategoryListItem[]>("/categories");
  return response.data;
};

export const createCategory = async (
  data: CreateCategoryDto
): Promise<CategoryListItem> => {
  const response = await api.post<CategoryListItem>("/categories", data);
  return response.data;
};

export const updateCategory = async (
  categoryId: number,
  data: UpdateCategoryDto
): Promise<CategoryListItem> => {
  const response = await api.patch<CategoryListItem>(`/categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (
  categoryId: number
): Promise<void> => {
  await api.delete(`/categories/${categoryId}`);
};

// Dashboard Stats
export interface DashboardStats {
  totalGMV: number;
  totalStores: number;
  pendingStores: number;
  activeUsers: number;
  newUsersThisWeek: number;
  apiLatency: number;
  region: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>("/admin/dashboard/stats");
  return response.data;
};

// Products
export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  categoryId: number;
  storeId: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  store?: {
    id: number;
    name: string;
    slug: string;
  };
  images?: Array<{
    id: number;
    url: string;
    isPrimary: boolean;
  }>;
}

export interface ProductsResponse {
  data: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  categoryId?: number;
  storeId?: number;
}

export const getProducts = async (
  params?: QueryProductsParams
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products/admin", { params });
  return response.data;
};

export const updateProductStatus = async (
  productId: number,
  data: { status: "APPROVED" | "REJECTED"; reason?: string }
): Promise<ProductListItem> => {
  const response = await api.patch<ProductListItem>(`/products/admin/${productId}/status`, data);
  return response.data;
};

// Orders
export interface OrderListItem {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  shippingStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  createdAt: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  store?: {
    id: number;
    name: string;
    slug: string;
  };
  orderItems?: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
}

export interface OrdersResponse {
  data: OrderListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  storeId?: number;
  userId?: number;
}

export const getOrders = async (
  params?: QueryOrdersParams
): Promise<OrdersResponse> => {
  const response = await api.get<OrdersResponse>("/orders/admin", { params });
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  data: { 
    status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    shippingStatus?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  }
): Promise<OrderListItem> => {
  const response = await api.patch<OrderListItem>(`/orders/admin/${orderId}`, data);
  return response.data;
};

// Analytics
export interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
  userGrowth: number;
  totalOrders: number;
  orderGrowth: number;
  activeStores: number;
  storeGrowth: number;
  conversionRate: number;
  avgOrderValue: number;
  customerRetention: number;
  topCategories: Array<{
    name: string;
    revenue: number;
    orders: number;
  }>;
  revenueChart: Array<{ date: string; amount: number }>;
  userChart: Array<{ date: string; count: number }>;
}

export interface QueryAnalyticsParams {
  timeRange?: "7d" | "30d" | "90d" | "1y";
  startDate?: string;
  endDate?: string;
  period?: "day" | "week" | "month" | "year";
}

export const getAnalytics = async (
  params?: QueryAnalyticsParams
): Promise<AnalyticsData> => {
  const response = await api.get<AnalyticsData>("/admin/analytics", { params });
  return response.data;
};

