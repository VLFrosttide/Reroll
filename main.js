"use strict";
const path = require("path"); // Include the path module
const { spawn } = require("child_process");
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require("electron");
const { error } = require("console");

let ItemName;
let Mod;
let Minroll;
let PythonArgs = [];
const CreateWindow = () => {
  const win = new BrowserWindow({
    width: 1200, // Correcting window size configuration
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload:
        "C:/Users/shacx/Documents/GitHub/HarvestClicker/renderer/preload.js",
    },
  });

  win.loadFile("renderer/Index.html");
};
app.whenReady().then(() => {
  CreateWindow();
  const ExistingMenu = Menu.getApplicationMenu();
  const NewItem = {
    label: "F1 kkey",
    click: () => {
      console.log("awdawdwdd");
    },
  };
  ExistingMenu.append(NewItem);
  Menu.setApplicationMenu(ExistingMenu);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  process.on("uncaughtException", (error) => {
    console.error("An uncaught exception occurred:", error);
  });
});
ipcMain.on("ModNames", (event, args) => {
  const Reroll = spawn("python", [
    "C:/Users/shacx/Documents/GitHub/HarvestClicker/renderer/Reroll.py",
    args[0],
    args[1],
    args[2],
  ]);
  Reroll.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  Reroll.stderr.on("error", (error) => {
    console.error(error.message);
  });
});
