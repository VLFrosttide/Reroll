import path from "path";
import fs from "fs";
import {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  ipcMain,
  Menu,
  nativeTheme,
  dialog,
} from "electron";
import { EventEmitter } from "events";
import "./HelperFunctionsBackend/LogFiles.js";
import {
  CreateLogFolder,
  DeleteFileContent,
  OpenFile,
  WriteToFile,
  ExportItemToFile,
  CheckFileExistence,
  LoadItem,
} from "./HelperFunctionsBackend/LogFiles.js";
import {
  CheckPython,
  CheckPyPackage,
} from "./HelperFunctionsBackend/PythonCheck.js";
import "./HelperFunctionsBackend/Craft.js";
import "./HelperFunctionsBackend/UseCurrency.js";
import { info } from "console";
nativeTheme.themeSource = "dark";

let win;
let LogFilePath;
let ItemExportPath;
let ScreenRatio;
let NewMenuTemplate;
let CaptureMouseEvent = new EventEmitter();
let MousePosition;
let ExePath = app.getPath("exe");
ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));
let PreloadPath = path.join(app.getAppPath(), "/renderer/preload.js");
//awdawdawdad
const CreateWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 550,
    x: 490,
    y: 0,
    title: "Reroll",

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
  CreateLogFolder(RerollFolder, DocPath);
  CheckPython(LogFilePath);
  CheckPyPackage("pyautogui", LogFilePath);
  CheckPyPackage("pyperclip", LogFilePath);

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
  ipcMain.on("ExportItem", (event, data) => {
    //data[0] = Positive mods
    //data[1] = Negative mods
    //data[2] = File name
    ItemExportPath = path.join(RerollFolder, `/${data[2]}.txt`);
    let FileExists = CheckFileExistence(ItemExportPath);
    console.log("File exists: ", FileExists);
    if (!FileExists) {
      ExportItemToFile(ItemExportPath, data[0], data[1]);
      win.webContents.send("ExportItem", "Confirmation");
      console.log("Confirmation sent!");
    } else {
      win.webContents.send("ExportItem", "NamingError");
      console.log("Some error..");
    }
  });
  ipcMain.on("FocusFix", (e, d) => {
    win.blur();
    win.focus();
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
          label: "Import an Item",
          accelerator: "Ctrl+q",

          click() {
            let MyFile = dialog.showOpenDialogSync(win, {
              properties: [OpenFile],
              filters: [{ name: "Text", extensions: ["txt"] }],
            });
            let MyFileContent = fs.readFileSync(MyFile[0], {
              encoding: "utf8",
              flag: "r",
            });
            let ItemMods = LoadItem(MyFileContent);
            win.webContents.send("ClearMods", "awd");
            win.webContents.send("ImportItem", ItemMods);
          },
        },
        {
          label: "Export Current Item",
          accelerator: "Ctrl+e",

          click() {
            win.webContents.send("ExportItem", "InitialRequest");
          },
        },
        {
          label: "Clear all mods",
          accelerator: "Ctrl+w",

          click() {
            win.webContents.send("ClearMods", "awd");
          },
        },

        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
    {
      label: "Options",
      submenu: [
        {
          label: "Clear All stored coords",
          click: async () => {
            let MsgRes = await dialog.showMessageBox({
              message:
                "Are you sure you want to delete ALL coords?\nThis will reset the proram completely",
              type: "question",
              buttons: ["OK", "Cancel"],
              title: "Reset all coords",
            });
            if (MsgRes.response === 0) {
              win.webContents.send("ClearLocalStorage", "awd");
            }
          },
        },
      ],
    },
    {
      label: "Logs",
      submenu: [
        {
          label: "Open logs",
          accelerator: "F2",
          click() {
            try {
              OpenFile(LogFilePath);
            } catch (err) {
              WriteToFile(LogFilePath, "Error opening the logfile: " + err);
              win.webContents.send(
                "error",
                "Error opening the logfile: " + err
              );
            }
          },
        },
        {
          label: "Delete logs",
          accelerator: "F4",
          click() {
            try {
              console.log("LogfilePath: ", LogFilePath);
              DeleteFileContent(LogFilePath);
              win.webContents.send("Logfile", "Deleted the log files!");
            } catch (err) {
              WriteToFile(
                LogFilePath,
                `Error deleting the ${LogFilePath} file: " + err`
              );
              win.webContents.send(
                "Logfile",
                `Error deleting the file ${LogFilePath} :  + ${err}`
              );
            }
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(NewMenuTemplate);
  Menu.setApplicationMenu(menu);
});

export { win };
