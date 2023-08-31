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
const CaptureMouseEvent = new EventEmitter();
let DisplayNumber;
let ItemName;
let MousePosition;
let Mod;
let Minroll;
let PythonArgs = [];

const CreateWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    x: 490,
    y: 0,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: "C:/Users/shacx/Documents/GitHub/Reroll/renderer/preload.js",
    },
  });

  CaptureMouseEvent.on("Coords", (data) => {
    console.log(data);
    win.webContents.send("MouseCoords", data);
  });

  ipcMain.on("ResizeWindow", (event, arg) => {
    console.log(arg);
    if (arg == "awd") {
      win.setBounds({ x: 440, y: 0, width: 700, height: 900 });
    } else {
      win.setBounds({ x: 490, y: 0, width: 600, height: 400 });
    }
  });

  win.loadFile("C:/Users/shacx/Documents/GitHub/Reroll/Hotkeys/Hotkeys.html");

  win.on("move", () => {
    const currentDisplay = screen.getDisplayNearestPoint({
      x: win.getPosition()[0],
      y: win.getPosition()[1],
    });
    DisplayNumber = currentDisplay.id;
    console.log("Window is on display:", currentDisplay.id);
  });
};

app.whenReady().then(() => {
  CreateWindow();

  const template = [
    // Your menu template remains unchanged
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  process.on("uncaughtException", (error) => {
    console.error("An uncaught exception occurred:", error);
  });
});

ipcMain.on("ModNames", (event, args) => {
  const Reroll = spawn("python", [
    "C:/Users/shacx/Documents/GitHub/Reroll/renderer/Reroll.py",
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
