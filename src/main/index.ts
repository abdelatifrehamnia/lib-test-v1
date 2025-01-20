import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import db from "./database/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.ts"),
      contextIsolation: true, // Recommended for security
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Initialize the database
const initializeDatabase = async () => {
  const database = await db;
  console.log("Database initialized");
  return database;
};

// Handle IPC messages from the renderer process
ipcMain.handle("get-products", async () => {
  const db = await initializeDatabase();
  return db.all("SELECT * FROM Products");
});

ipcMain.handle("add-product", async (event, product) => {
  const db = await initializeDatabase();
  const { designation, brand_id, model_id, article_code } = product;
  const result = await db.run(
    "INSERT INTO Products (designation, brand_id, model_id, article_code) VALUES (?, ?, ?, ?)",
    [designation, brand_id, model_id, article_code]
  );
  return result;
});

app.on("ready", () => {
  createWindow();
  initializeDatabase();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
