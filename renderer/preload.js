const { ipcRenderer, contextBridge } = require("electron");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  MousePos: (callback) => ipcRenderer.on("MouseCoords", callback),
  ClearLocalStorage: (callback) =>
    ipcRenderer.on("ClearLocalStorage", callback),
  ResizeWindow: (callback) => {
    ipcRenderer.send("ResizeWindow", callback);
  },
  StartCrafting: (callback) => {
    ipcRenderer.send("StartCrafting", callback);
  },
  ScreenRatio: () => {
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
