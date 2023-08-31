const { ipcRenderer, contextBridge } = require("electron");
console.log("Preload script is running");

contextBridge.exposeInMainWorld("api", {
  // SendCraftMethod: (variable) => {
  //   ipcRenderer.send("CraftMaterial", variable);
  // },
  SendModNames: (variable) => {
    ipcRenderer.send("ModNames", variable);
  },
});

window.addEventListener("error", (event) => {
  console.error(
    "An unhandled error occurred in the preload script:",
    event.error
  );
});
