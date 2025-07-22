import { Product } from './product.model';

export interface Category {
  id?: number;
  name: string; // Max 100 characters
  description?: string; // Optional, max 255 characters
  products?: Product[];
}