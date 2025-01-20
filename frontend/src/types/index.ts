export interface Product {
  id?: number;
  designation: string;
  articleCode: string;
  brandId?: number;
  modelId?: number;
  criterion?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Brand {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Model {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Inventory {
  id?: number;
  productId: number;
  minimumStock: number;
  initialStock: number;
  currentStock: number;
  stockAlert: boolean;
  lastUpdated?: Date;
}

export interface Price {
  id?: number;
  productId: number;
  unitPriceWholesale: number;
  unitPriceRetail: number;
  validFrom: Date;
  validTo?: Date;
}

export interface User {
  id?: number;
  name: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  id?: number;
  userId: number;
  orderDate: Date;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
}

export interface OrderDetail {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerPrice {
  id?: number;
  productId: number;
  userId: number;
  unitPriceWholesale: number;
  unitPriceRetail: number;
  validFrom: Date;
  validTo?: Date;
}

export interface StockMovement {
  id?: number;
  productId: number;
  movementType: "in" | "out";
  quantity: number;
  movementDate: Date;
}

export interface SyncMeta {
  id?: number;
  lastSyncTime: Date;
  lastSyncStatus: string;
}

export type EntityType =
  | "products"
  | "brands"
  | "models"
  | "inventory"
  | "prices"
  | "users"
  | "orders"
  | "orderDetails"
  | "customerPrices"
  | "stockMovements"
  | "syncMeta";
