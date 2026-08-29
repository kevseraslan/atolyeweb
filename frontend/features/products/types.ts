export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active?: boolean;
}

export interface Color {
  id: number;
  name: string;
  hex_code?: string;
  texture_url?: string;
  is_active?: boolean;
}

export interface Material {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface ProductImage {
  id: number;
  cloudinary_public_id: string;
  secure_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  category: Category;
  primary_image?: ProductImage;
  is_featured: boolean;
  is_customizable: boolean;
  is_active?: boolean;
  colors: Color[];
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  default_width?: number;
  default_height?: number;
  default_depth?: number;
  is_customizable: boolean;
  is_featured: boolean;
  is_active?: boolean;
  category: Category;
  images: ProductImage[];
  colors: Color[];
  materials: Material[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
