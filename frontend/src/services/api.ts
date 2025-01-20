import { Product } from "../types";

const API_BASE = import.meta.env.VITE_API_URL;

class ApiService {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`);
    return response.json();
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  }

  async updateProduct(product: Product): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  }

  async deleteProduct(id: number): Promise<void> {
    await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
