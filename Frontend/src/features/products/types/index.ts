export type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  imageUrl: string;
  isNew: boolean;
  isPrime?: boolean;
};
