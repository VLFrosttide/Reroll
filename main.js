"use strict";
//  Use electromon to start the program

const path = require("path");

const { spawn } = require("child_process");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  screen,
  globalShortcut,
} = require("electron");
const EventEmitter = require("events");
const CaptureMouseEvent = new EventEmitter();
let MousePosition;
let template;
let win;
let ScreenRatio;
const CreateWindow = () => {
  const PreloadPath = path.join(__dirname, "/renderer/preload.js");
  win = new BrowserWindow({
    width: 600,
    height: 460,
    x: 490,
    y: 0,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: PreloadPath,
    },
  });
  CaptureMouseEvent.on("Coords", (data) => {
    win.webContents.send("MouseCoords", data);
  });
  ipcMain.on("StartCrafting", (event, args) => {
    let ModName = args[0];
    let MaxRolls = args[1];
    let CurrencyCoords = args[2];
    let TabCoords = args[3];
    let CraftMaterial = args[4];
    console.log("CraftMats: ", CraftMaterial);
    const RerollPath = path.join(__dirname, "/renderer/Reroll.py");
    const StartCrafting = spawn("python", [
      RerollPath,
      ModName,
      MaxRolls,
      CurrencyCoords,
      TabCoords,
      CraftMaterial,
    ]);
    StartCrafting.stdout.on("data", (data) => {
      console.log("MyData:", data.toString());
      let PrintThis = String(data);
      if (PrintThis.includes("Rarity")) {
        win.webContents.send(
          "RarityError",
          "The currency you're trying to use does not match the rarity of your item"
        );
      }
      if (PrintThis.includes("Item Not Found")) {
        win.webContents.send("ItemError", "Item Not Found");
      }
    });
    StartCrafting.stderr.on("data", (data) => {
      console.error("error: ", data.toString());
    });
    StartCrafting.on("exit", (code, signal) => {
      if (code !== null) {
        console.log(`Child process exited with code ${code}`);
      } else if (signal !== null) {
        console.log(`Child process was killed by signal ${signal}`);
      } else {
        console.log("Child process has exited");
      }
    });
  });
  ipcMain.on("TriggerAddon", (event, args) => {
    let ItemName = args;
    console.log("Args from frontend: ", args);
    const AddonPath = path.join(__dirname, "/renderer/Addon.py");
    const Addon = spawn("python", [AddonPath, ItemName]);
  });
  ipcMain.on("ResizeWindow", (event, arg) => {
    if (arg == "awd") {
      win.setSize(700, 900);
    } else {
      win.setSize(600, 460);
    }
  });

  win.loadFile("renderer/Index.html");

  template = [
    {
      label: "Hotkeys",
      submenu: [
        {
          label: "Capture Mouse position",
          accelerator: "F1",
          click() {
            MousePosition = screen.getCursorScreenPoint();
            MousePosition = JSON.stringify(MousePosition);
            MousePosition = MousePosition.replace(/[^\d,]/g, "");
            CaptureMouseEvent.emit("Coords", MousePosition);
          },
        },
        {
          label: "Reload",
          accelerator: "Ctrl+R",
          role: "forceReload",
        },
        {
          label: "Dev tools",
          role: "toggleDevTools",
          accelerator: "Ctrl+`",
        },
        {
          label: "Clear All stored coords",
          click() {
            win.webContents.send("ClearLocalStorage", "awd");
            setTimeout(() => {
              win.webContents.reload();
            }, 100);
          },
          // role: "forceReload",
        },
        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
  ];
};

app.whenReady().then(() => {
  const StartCraft = globalShortcut.register("Control+Enter", () => {
    console.log("Crafting Started!");
    win.webContents.send("StartCraft", "Crafting Started");
  });
  const Scour = globalShortcut.register("Control+Backspace", () => {
    console.log("Scour function triggered");
    win.webContents.send("GlobalKey", "Scour");
  });
  const Augment = globalShortcut.register("Shift+Enter", () => {
    console.log("Augment function triggered");
    win.webContents.send("GlobalKey", "Augment");
  });
  const Annul = globalShortcut.register("Shift+Backspace", () => {
    console.log("Annul function triggered");
    win.webContents.send("GlobalKey", "Annul");
  });
  const Regal = globalShortcut.register("Control+Shift+Enter", () => {
    console.log("Regal function triggered");
    win.webContents.send("GlobalKey", "Regal");
  });
  const Transmute = globalShortcut.register("Control+Alt+Enter", () => {
    console.log("Transmute function triggered");
    win.webContents.send("GlobalKey", "Transmute");
  });
  CreateWindow();
  ScreenRatio = screen.getPrimaryDisplay().scaleFactor;
  ipcMain.on("ScreenRatio", (event) => {
    event.reply("ScreenRatioValue", ScreenRatio);
  });
  win.webContents.send("ScreenRatio", ScreenRatio);

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  process.on("uncaughtException", (error) => {
    console.error("An uncaught exception occurred:", error);
  });
});
