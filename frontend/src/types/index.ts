export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  image_file_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_file_id?: string;
  display_order: number;
  is_thumbnail: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  category_id: string;
  category_name?: string;
  specs: Record<string, string | number>;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedImage?: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";
export type PaymentMethod = "COD" | "ONLINE";

export interface OrderItem {
  id: string;
  product_id?: string;
  product_name: string;
  product_price: number;
  product_image_url?: string;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  city: string;
  address: string;
  notes?: string;
  total_amount: number;
  shipping_fee: number;
  grand_total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  link_url?: string;
  image_url: string;
  image_file_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  store_phone: string;
  store_whatsapp: string;
  store_email: string;
  store_address: string;
  shipping_fee: number;
  free_shipping_threshold: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface DailySalesStat {
  date: string;
  orders_count: number;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  image_url?: string | null;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  low_stock_count: number;
  recent_orders: Order[];
  low_stock_products: LowStockProduct[];
  sales_chart: DailySalesStat[];
}
