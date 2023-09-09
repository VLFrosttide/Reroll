"use strict";
const path = require("path");
const { spawn } = require("child_process");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  screen,
} = require("electron");
const EventEmitter = require("events");
const { type } = require("os");
const { test } = require("picomatch");
const { error } = require("console");
const { eventNames } = require("process");
const CaptureMouseEvent = new EventEmitter();
let DisplayNumber;
let ItemName;
let MousePosition;
let Mod;
let Minroll;
let PythonArgs = [];
let ScreenTimeout;
let ItemCoords;
let template;
let EssenceTabCoords;
let CurrencyTabCoords;
let EssenceCoords;
let CurrencyCoords;
let currentScreen;
const CreateWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 460,
    x: 490,
    y: 0,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: "C:/Users/shacx/Documents/GitHub/Reroll/renderer/preload.js",
    },
  });
  ipcMain.on("CurrencyTabCoords", (event, data) => {
    CurrencyTabCoords = JSON.parse(data);
    for (const Item of Object.keys(CurrencyTabCoords)) {
      CurrencyTabCoords = [
        parseInt(CurrencyTabCoords[Item].Coords[0]),
        parseInt(CurrencyTabCoords[Item].Coords[1]),
      ];
    }
  });

  ipcMain.on("EssenceTabCoords", (event, data) => {
    EssenceTabCoords = JSON.parse(data);
    for (const Item of Object.keys(EssenceTabCoords)) {
      EssenceTabCoords = [
        parseInt(EssenceTabCoords[Item].Coords[0]),
        parseInt(EssenceTabCoords[Item].Coords[1]),
      ];
    }
  });
  CaptureMouseEvent.on("Coords", (data) => {
    win.webContents.send("MouseCoords", data);
  });
  ipcMain.on("StartCrafting", (event, args) => {
    let Coords;
    let TabCoords;
    let CurrencyName = args[0];
    if (CurrencyName.includes("Orb")) {
      for (const Item of Object.keys(CurrencyCoords)) {
        if (CurrencyCoords[Item].Name == CurrencyName) {
          Coords = CurrencyCoords[Item].Coords;
          TabCoords = CurrencyTabCoords;
        }
      }
    } else {
      if (CurrencyName.toLowerCase().includes("essence")) {
        for (const Item of Object.keys(EssenceCoords)) {
          if (EssenceCoords[Item].Name == CurrencyName) {
            Coords = EssenceCoords[Item].Coords;
            TabCoords = EssenceTabCoords;
          }
        }
      }
    }

    console.log(Coords);
    const StartCrafting = spawn("python", [
      "C:/Users/shacx/Documents/GitHub/Reroll/renderer/Reroll.py",
      Coords,
      args[1], // Mod to look for
      args[2], // Max Rerolls
      TabCoords,
    ]);
    StartCrafting.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    StartCrafting.stderr.on("error", (error) => {
      console.error(error.message);
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
  ipcMain.on("CurrencyCoords", (event, data) => {
    CurrencyCoords = JSON.parse(data);
    for (const Item of Object.keys(CurrencyCoords)) {
      CurrencyCoords[Item].Coords = [
        parseInt(CurrencyCoords[Item].Coords[0] * currentScreen.scaleFactor),
        parseInt(CurrencyCoords[Item].Coords[1] * currentScreen.scaleFactor),
      ];
    }
    // console.log("Sending");
    console.log(CurrencyCoords);
    win.webContents.send("UpdatedCurrencyCoords", CurrencyCoords);
    // console.log("Sent");
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
  CreateWindow();
  currentScreen = screen.getPrimaryDisplay();

  ipcMain.on("EssenceCoords", (event, data) => {
    // EssenceCoords = JSON.str(data);
    const EssenceClass = spawn("python", [
      "C:/Users/shacx/Documents/GitHub/Reroll/EssenceClass.py",
      data,
      currentScreen.scaleFactor,
    ]);
    EssenceClass.stderr.on("data", (error) => {
      console.error("The error is: " + error);
    });
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  process.on("uncaughtException", (error) => {
    console.error("An uncaught exception occurred:", error);
  });
});
