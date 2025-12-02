export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  name: string;
  province_id: string;
}

export interface District {
  id: string;
  name: string;
  regency_id: string;
}

export interface SubDistrict {
  id: string;
  name: string;
  district_id: string;
}

export interface ShippingService {
  id: string;
  name: string;
  estimation: string;
  price: number;
}

export interface ShippingProvider {
  name: string;
  services: ShippingService[];
}

export interface ShippingData {
  sicepat: ShippingProvider;
  jne: ShippingProvider;
  gosend: ShippingProvider;
  tiki: ShippingProvider;
  jnt: ShippingProvider;
  pos: ShippingProvider;
}
