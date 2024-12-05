const { ipcRenderer, contextBridge } = require("electron");
// const { call } = require("function-bind");
// console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  RarityError: (callback) => ipcRenderer.on("ItemError", callback),
  MousePos: (callback) => ipcRenderer.on("MouseCoords", callback),
  Logfile: (callback) => ipcRenderer.on("Logfile", callback),
  ClearMods: (callback) => ipcRenderer.on("ClearMods", callback),

  ExportItemsListener: (callback) => ipcRenderer.on("ExportItem", callback),
  ClearLocalStorage: (callback) =>
    ipcRenderer.on("ClearLocalStorage", callback),

  ItemError: (callback) => ipcRenderer.on("RarityError", callback),

  StartCraft: (callback) => ipcRenderer.on("StartCraft", callback),
  GlobalKey: (callback) => ipcRenderer.on("GlobalKey", callback),
  Counter: (callback) => ipcRenderer.on("Counter", callback),
  TriggerCurrencyUse: (callback) => {
    ipcRenderer.send("TriggerCurrencyUse", callback);
  },
  FocusFix: (callback) => {
    ipcRenderer.send("FocusFix", callback);
  },
  ReturnExportData: (callback) => {
    ipcRenderer.send("ExportItem", callback);
  },
  ResizeWindow: (callback) => {
    ipcRenderer.send("ResizeWindow", callback);
  },
  StartCrafting: (callback) => {
    ipcRenderer.send("StartCrafting", callback);
  },
  ScreenRatio: (callback) => {
    ipcRenderer.send("ScreenRatio");
  },
  ScreenRatioValue: (callback) => {
    ipcRenderer.on("ScreenRatioValue", (event, ...args) => {
      callback(...args);
    });
  },
});
window.addEventListener("error", (event) => {
  console.log("Error event:", event);
});
