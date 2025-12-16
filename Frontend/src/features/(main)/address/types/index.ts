export interface Address {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  biteship_area_id?: string;
}

export interface CreateAddressPayload {
  label: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  address: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
  biteship_area_id?: string;
}

export interface UpdateAddressPayload {
  label?: string;
  recipient?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  subDistrict?: string;
  postalCode?: string;
  address?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
  biteship_area_id?: string;
}

