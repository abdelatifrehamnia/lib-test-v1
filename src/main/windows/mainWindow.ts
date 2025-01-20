import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import db from "../database/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Declare the mainWindow variable
let mainWindow: BrowserWindow | null = null;

// Function to create the main window
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200, // Initial width of the window
    height: 800, // Initial height of the window
    minWidth: 800, // Minimum width of the window
    minHeight: 600, // Minimum height of the window
    title: "My Electron App", // Title of the window
    icon: path.join(__dirname, "../../public/icon.png"), // App icon
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.ts"), // Preload script
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Disable Node.js integration in the renderer process
    },
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    // Load the Vite dev server URL in development
    mainWindow.loadURL("http://localhost:3000");
    // Open the DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Load the built index.html file in production
    mainWindow.loadFile(path.join(__dirname, "../../index.html"));
  }

  // Handle window close event
  mainWindow.on("closed", () => {
    mainWindow = null; // Dereference the window object
  });

  // Optional: Customize the menu bar
  mainWindow.setMenuBarVisibility(false); // Hide the menu bar
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

// When the app is ready, create the main window
app.on("ready", () => {
  createWindow();
  initializeDatabase();
});

// Quit the app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Recreate the main window if it's closed and the app is still active (macOS)
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
