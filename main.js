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
let MousePosition;
let template;
let win;
let ScreenRatio;
const CreateWindow = () => {
  const PreloadPath = path.join(__dirname, "/renderer/preload.js")
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
    const RerollPath = path.join(__dirname, "/renderer/Reroll.py")
    const StartCrafting = spawn("python", [
      RerollPath,
      ModName,
      MaxRolls,
      CurrencyCoords,
      TabCoords,
    ]);
    StartCrafting.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    StartCrafting.stderr.on("data", (data) => {
      console.error(data.toString()); // Log Python error messages
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
