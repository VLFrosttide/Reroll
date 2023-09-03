const { ipcRenderer, contextBridge } = require("electron");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  SendModNames: (variable) => {
    ipcRenderer.send("ModNames", variable);
  },
  MousePos: (callback) => ipcRenderer.on("MouseCoords", callback),
  ClearLocalStorage: (callback) =>
    ipcRenderer.on("ClearLocalStorage", callback),
  ResizeWindow: (callback) => {
    ipcRenderer.send("ResizeWindow", callback);
  },
  SendTestCoords: (variable) => {
    ipcRenderer.send("TestCoords", variable);
  },
});
window.addEventListener("error", (event) => {
  console.error(
    "An unhandled error occurred in the preload script:",
    event.error
  );
});
