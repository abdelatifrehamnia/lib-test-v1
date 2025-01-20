import { contextBridge, ipcRenderer } from "electron";

// Define the type for the exposed API
interface ExposedAPI {
  getProducts: () => Promise<any>;
  addProduct: (product: any) => Promise<any>;
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("electron", {
  getProducts: () => ipcRenderer.invoke("get-products"),
  addProduct: (product: any) => ipcRenderer.invoke("add-product", product),
} as ExposedAPI);
