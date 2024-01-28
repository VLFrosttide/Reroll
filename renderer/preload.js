const { ipcRenderer, contextBridge } = require("electron");
const { call } = require("function-bind");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  MousePos: (callback) => ipcRenderer.on("MouseCoords", callback),
  ClearLocalStorage: (callback) =>
    ipcRenderer.on("ClearLocalStorage", callback),

  ItemError: (callback) => ipcRenderer.on("ItemError", callback),
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
  GlobalKey: (callback) => ipcRenderer.on("GlobalKey", call),
});
window.addEventListener("error", (event) => {
  console.log("Error event:", event);
});
