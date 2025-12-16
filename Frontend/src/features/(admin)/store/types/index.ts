export interface CreateStorePayload {
  name: string;
  slug: string;
  locationId?: number;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  locationId?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
