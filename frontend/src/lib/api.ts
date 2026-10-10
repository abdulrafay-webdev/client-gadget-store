import {
  Category,
  Product,
  ProductListResponse,
  Order,
  OrderListResponse,
  Banner,
  StoreSettings,
  DashboardStats,
  AdminUser
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle FormData where Content-Type is set automatically by the browser
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = "An unexpected error occurred";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `Request failed with status ${res.status}`;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export const api = {
  // Public Storefront Endpoints
  async getCategories(): Promise<Category[]> {
    return request<Category[]>("/categories");
  },

  async getCategory(idOrSlug: string): Promise<Category> {
    return request<Category>(`/categories/${idOrSlug}`);
  },

  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
    is_featured?: boolean;
  }): Promise<ProductListResponse> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.append(key, String(value));
        }
      });
    }
    return request<ProductListResponse>(`/products?${query.toString()}`);
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return request<Product[]>(`/products/featured?limit=${limit}`);
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    return request<Product>(`/products/${idOrSlug}`);
  },

  async getRelatedProducts(idOrSlug: string, limit = 4): Promise<Product[]> {
    return request<Product[]>(`/products/${idOrSlug}/related?limit=${limit}`);
  },

  async getBanners(): Promise<Banner[]> {
    return request<Banner[]>("/banners");
  },

  async getSettings(): Promise<StoreSettings> {
    return request<StoreSettings>("/settings");
  },

  async createOrder(orderData: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    city: string;
    address: string;
    notes?: string;
    payment_method?: string;
    items: { product_id: string; quantity: number }[];
  }): Promise<Order> {
    return request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  async trackOrder(orderNumber: string, phone: string): Promise<Order> {
    const params = new URLSearchParams({
      order_number: orderNumber,
      phone: phone,
    });
    return request<Order>(`/orders/track?${params.toString()}`);
  },

  // Admin Endpoints
  async adminLogin(email: string, password: string): Promise<{ access_token: string; admin: AdminUser }> {
    return request<{ access_token: string; admin: AdminUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getAdminMe(): Promise<AdminUser> {
    return request<AdminUser>("/auth/me");
  },

  async getAdminDashboard(): Promise<DashboardStats> {
    return request<DashboardStats>("/admin/dashboard/stats");
  },

  async getAdminProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
  }): Promise<ProductListResponse> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }
    return request<ProductListResponse>(`/admin/products/all?${query.toString()}`);
  },

  async createProduct(productData: any): Promise<Product> {
    return request<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id: string, productData: any): Promise<Product> {
    return request<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  async getAdminCategories(): Promise<Category[]> {
    return request<Category[]>("/admin/categories/all");
  },

  async createCategory(catData: any): Promise<Category> {
    return request<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(catData),
    });
  },

  async updateCategory(id: string, catData: any): Promise<Category> {
    return request<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(catData),
    });
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  },

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status_filter?: string;
    payment_status_filter?: string;
    search?: string;
  }): Promise<OrderListResponse> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }
    return request<OrderListResponse>(`/orders/admin?${query.toString()}`);
  },

  async getAdminOrder(id: string): Promise<Order> {
    return request<Order>(`/orders/admin/${id}`);
  },

  async updateOrderStatus(id: string, data: { status?: string; payment_status?: string }): Promise<Order> {
    return request<Order>(`/orders/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async uploadImage(file: File): Promise<{ url: string; file_id: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ url: string; file_id: string }>("/admin/upload", {
      method: "POST",
      body: formData,
    });
  },

  async deleteImage(fileId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/admin/upload/${fileId}`, {
      method: "DELETE",
    });
  },

  async getAdminBanners(): Promise<Banner[]> {
    return request<Banner[]>("/admin/banners/all");
  },

  async createBanner(bannerData: any): Promise<Banner> {
    return request<Banner>("/admin/banners", {
      method: "POST",
      body: JSON.stringify(bannerData),
    });
  },

  async deleteBanner(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/banners/${id}`, {
      method: "DELETE",
    });
  },

  async getAdminSettings(): Promise<any[]> {
    return request<any[]>("/settings/admin");
  },

  async updateAdminSettings(settingsMap: Record<string, string>): Promise<{ message: string }> {
    return request<{ message: string }>("/settings/admin", {
      method: "PUT",
      body: JSON.stringify({ settings: settingsMap }),
    });
  },
};
