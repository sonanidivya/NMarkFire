export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products?: Product[];
  subcategories?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  applications?: string[];
  specifications?: Record<string, string>;
  image?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
}
