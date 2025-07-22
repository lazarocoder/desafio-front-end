export interface Product {
  id?: number;
  name: string; // Required, max 100 characters
  description?: string; // Optional, max 255 characters
  price: number; // Required, must be > 0
  status: boolean; // Required
  code?: string;
  category: any; // Required
}