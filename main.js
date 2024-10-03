import path from "path";
import {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  ipcMain,
  Menu,
} from "electron";
import { EventEmitter } from "events";
import "./HelperFunctions/LogFiles.js";
import { CreateLogs } from "./HelperFunctions/LogFiles.js";
import { CheckPython, CheckPyPackage } from "./HelperFunctions/PythonCheck.js";
import "./HelperFunctions/Craft.js";
let win;
let LogFilePath;
let ScreenRatio;
let NewMenuTemplate;
let CaptureMouseEvent = new EventEmitter();
let MousePosition;

const CreateWindow = () => {
  let PreloadPath =
    "C:/Users/shacx/Documents/GitHub/Reroll-Improved/renderer/preload.js";
  win = new BrowserWindow({
    width: 800,
    height: 550,
    x: 490,
    y: 0,
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: PreloadPath,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["self"],
          scriptSrc: ["self"],
          styleSrc: ["self"],
          imgSrc: ["self"],
          fontSrc: ["self"],
          connectSrc: ["self"],
          manifestSrc: ["self"],
          // Add more directives as needed for your app
        },
      },
    },
  });

  win.loadFile("renderer/index.html");
};

app.whenReady().then(() => {
  globalShortcut.unregisterAll();
  CreateWindow();
  const DocPath = app.getPath("documents");
  const RerollFolder = path.join(DocPath, "RerollLogs");
  LogFilePath = path.join(RerollFolder, "/Logs.txt");
  CreateLogs(RerollFolder, DocPath);
  CheckPython(LogFilePath);
  CheckPyPackage("pyautogui", LogFilePath);
  CheckPyPackage("pyperclip", LogFilePath);

  // CaptureMouseEvent.on("Coords", (data) => {
  //   win.webContents.send("MouseCoords", data);
  // });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  const StartCraft = globalShortcut.register("Control+Enter", () => {
    console.log("Crafting hotkey working!");

    win.webContents.send("StartCraft", "Crafting Started");
  });

  const Scour = globalShortcut.register("Control+Backspace", () => {
    console.log("Scour function triggered");
    win.webContents.send("GlobalKey", "ScourOrb");
  });
  const Augment = globalShortcut.register("Shift+Enter", () => {
    console.log("Augment function triggered");
    win.webContents.send("GlobalKey", "AugOrb");
  });
  const Annul = globalShortcut.register("Shift+Backspace", () => {
    console.log("Annul function triggered");
    win.webContents.send("GlobalKey", "AnnulOrb");
  });
  const Regal = globalShortcut.register("Control+Shift+Enter", () => {
    console.log("Regal function triggered");
    win.webContents.send("GlobalKey", "RegalOrb");
  });
  const Transmute = globalShortcut.register("Control+Alt+Enter", () => {
    console.log("Transmute function triggered");
    win.webContents.send("GlobalKey", "TransmuteOrb");
  });

  ScreenRatio = screen.getPrimaryDisplay().scaleFactor;
  ipcMain.on("ScreenRatio", (event) => {
    event.reply("ScreenRatioValue", ScreenRatio);
  });
  CaptureMouseEvent.on("Coords", (data) => {
    win.webContents.send("MouseCoords", data);
  });
  win.webContents.send("ScreenRatio", ScreenRatio);
  process.on("uncaughtException", (error) => {
    console.error("An uncaught exception occurred:", error);
  });
  NewMenuTemplate = [
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
          },
        },
        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(NewMenuTemplate);
  Menu.setApplicationMenu(menu);
});

export { win };
