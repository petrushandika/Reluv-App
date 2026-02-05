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

