const { ipcRenderer, contextBridge } = require("electron");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  MousePos: (callback) => ipcRenderer.on("MouseCoords", callback),
  ClearLocalStorage: (callback) =>
    ipcRenderer.on("ClearLocalStorage", callback),
  UpdatedCurrencyCoords: (callback) =>
    ipcRenderer.on("UpdatedCurrencyCoords", callback),
  ResizeWindow: (callback) => {
    ipcRenderer.send("ResizeWindow", callback);
  },
  StartCrafting: (callback) => {
    ipcRenderer.send("StartCrafting", callback);
  },
  EssenceTabCoords: (variable) => {
    ipcRenderer.send("EssenceTabCoords", variable);
  },
  CurrencyTabCoords: (variable) => {
    ipcRenderer.send("CurrencyTabCoords", variable); //
  },
  EssenceCoords: (variable) => {
    ipcRenderer.send("EssenceCoords", variable); //
  },
  CurrencyCoords: (variable) => {
    ipcRenderer.send("CurrencyCoords", variable);
  },
});
window.addEventListener("error", (event) => {
  console.log("Error event:", event);
});
