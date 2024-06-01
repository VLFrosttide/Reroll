"use strict";
//  Use npm start to start the program

const path = require("path");

const { spawn } = require("child_process");
const fs = require("fs");

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
const DocPath = app.getPath("documents");
let ExePath = app.getPath("exe");
ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));
console.log("ExePath: ", ExePath);
const RerollFolder = path.join(DocPath, "RerollLogs");
if (!fs.existsSync(RerollFolder)) {
  fs.mkdirSync(RerollFolder, { recursive: true });
}
const LogFile = path.join(RerollFolder, "/Logs.txt");
try {
  fs.appendFileSync(LogFile, "Program works");
  console.log("Log written successfully");
} catch (err) {
  console.error("Error writing to log file:", err);
}

const CreateWindow = () => {
  const PreloadPath = path.join(__dirname, "/renderer/preload.js");
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
  win.webContents.send("Logfile", String(LogFile));
  CaptureMouseEvent.on("Coords", (data) => {
    win.webContents.send("MouseCoords", data);
  });
  ipcMain.on("StartCrafting", (event, args) => {
    fs.appendFileSync(LogFile, "Start craft works");
    fs.appendFileSync(LogFile, "Python script spawned");
    let ModName = args[0];
    let MaxRolls = args[1];
    let CurrencyCoords = args[2];
    let TabCoords = args[3];
    let CraftMaterial = args[4];
    let Fracture = args[5];
    console.log("CurrencyCoords: ", CurrencyCoords);
    console.log("TabCoords: ", TabCoords);
    const RerollPath = path.join(ExePath, "/renderer/Reroll.py");

    const StartCrafting = spawn("python", [
      RerollPath,
      ModName,
      MaxRolls,
      CurrencyCoords,
      TabCoords,
      CraftMaterial,
      Fracture,
    ]);
    StartCrafting.stdout.on("data", (data) => {
      console.log("MyData:", data.toString());
      fs.appendFileSync(LogFile, String(data));
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
      fs.appendFileSync(LogFile, `Error: ${String(data)}`);
    });
    StartCrafting.on("exit", (code, signal) => {
      if (code !== null) {
        console.log(`Child process exited with code ${code}`);
        fs.appendFileSync(LogFile, `Child process exited with code ${code}`);
      } else if (signal !== null) {
        console.log(`Child process was killed by signal ${signal}`);
        fs.appendFileSync(
          LogFile,
          `Child process was killed by signal ${signal}`
        );
      } else {
        console.log("Child process has exited");
        fs.appendFileSync(LogFile, "Child process has exited");
      }
    });
  });
  ipcMain.on("TriggerAddon", (event, args) => {
    let CurrencyCoords = args[0];
    let ItemCoords = args[1];
    // console.log(args);
    const AddonPath = path.join(ExePath, "/renderer/Addon.py");
    const Addon = spawn("python", [AddonPath, CurrencyCoords, ItemCoords]);
    Addon.stdout.on("data", (data) => {
      console.log(String(data));
      fs.appendFileSync(LogFile, `${String(data)}`);
    });

    Addon.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      fs.appendFileSync(LogFile, `${data}`);
    });

    Addon.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
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
  const StartCraft = globalShortcut.register("Control+Enter", () => {
    console.log("Crafting Started!");
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
