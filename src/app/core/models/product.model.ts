export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  status: ProductStatus;
  category: Category;
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  status: ProductStatus;
  categoryId: number;
} 