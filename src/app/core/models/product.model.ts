export interface Product {
  id?: number;
  name: string; // Required, max 100 characters
  description?: string; // Optional, max 255 characters
  price: number; // Required, must be > 0
  status: ProductStatus; // Required
  category: Category; // Required
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Category {
  id?: number;
  name: string; // Max 100 characters
  description?: string; // Optional, max 255 characters
}

export interface ProductFormData {
  name: string; // Required, max 100 characters
  description?: string; // Optional, max 255 characters
  price: number; // Required, must be > 0
  status: ProductStatus; // Required
  categoryId: number; // Required
} 