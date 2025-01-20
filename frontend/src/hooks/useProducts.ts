import { useEffect, useState } from "react";
import { api } from "../services/api";
import { idb } from "../services/db";
import { Product } from "../types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductsFromIndexedDB = async () => {
    try {
      const localProducts = await idb.getAll("products");
      setProducts(localProducts);
      setError(null);
    } catch (err) {
      setError("Failed to load products from local storage");
    }
  };

  const syncProductsWithServer = async () => {
    try {
      const unsyncedChanges = await idb.getUnsyncedChanges();

      for (const change of unsyncedChanges) {
        switch (change.operation) {
          case "create":
            await api.createProduct(change.payload);
            break;
          case "update":
            await api.updateProduct(change.payload);
            break;
          case "delete":
            await api.deleteProduct(change.payload.id);
            break;
        }
        await idb.markAsSynced(change.id);
      }

      const serverProducts = await api.getProducts();
      setProducts(serverProducts);
    } catch (err) {
      console.error("Failed to sync products with server:", err);
    }
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const newProductId = await idb.add("products", product);
      const newProduct = { ...product, id: newProductId };
      setProducts((prev) => [...prev, newProduct]);

      await idb.addToSyncQueue("products", "create", newProduct);

      if (navigator.onLine) {
        await syncProductsWithServer();
      }
    } catch (err) {
      setError("Failed to add product");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadProductsFromIndexedDB();
      if (navigator.onLine) {
        await syncProductsWithServer();
      }
    };
    fetchData();
  }, []);

  return { products, loading, error, addProduct };
};
