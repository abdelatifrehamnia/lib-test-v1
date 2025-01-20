import { openDB, DBSchema, IDBPDatabase } from "idb";
import { EntityType, Product } from "../types";

interface LibraryDB extends DBSchema {
  products: {
    key: number;
    value: Product;
    indexes: { "by-articleCode": string };
  };
  syncQueue: {
    key: number;
    value: {
      id?: number; // Make `id` optional
      entityType: EntityType;
      entityId: number;
      operation: "create" | "update" | "delete";
      payload: any;
      synced: boolean;
    };
  };
}

const DB_NAME = "LibraryDB";
const DB_VERSION = 2;

class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<LibraryDB>>;

  constructor() {
    this.dbPromise = openDB<LibraryDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("products")) {
          const store = db.createObjectStore("products", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("by-articleCode", "articleCode", { unique: true });
        }

        if (!db.objectStoreNames.contains("syncQueue")) {
          db.createObjectStore("syncQueue", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  }

  async getAll<T extends "products">(
    entityType: T
  ): Promise<Array<LibraryDB[T]["value"]>> {
    const db = await this.dbPromise;
    return db.getAll(entityType);
  }

  async add<T extends "products">(
    entityType: T,
    data: Omit<LibraryDB[T]["value"], "id">
  ): Promise<number> {
    const db = await this.dbPromise;
    return db.add(entityType, data as any);
  }

  async addToSyncQueue(
    entityType: EntityType,
    operation: "create" | "update" | "delete",
    payload: any
  ): Promise<number> {
    const db = await this.dbPromise;
    return db.add("syncQueue", {
      entityType,
      entityId: payload.id,
      operation,
      payload,
      synced: false,
    });
  }

  async getUnsyncedChanges(): Promise<Array<LibraryDB["syncQueue"]["value"]>> {
    const db = await this.dbPromise;
    return db.getAll("syncQueue");
  }

  async markAsSynced(id: number): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction("syncQueue", "readwrite");
    const store = tx.objectStore("syncQueue");
    const item = await store.get(id);
    if (item) {
      item.synced = true;
      await store.put(item);
    }
    await tx.done;
  }
}

export const idb = new IndexedDBService();
