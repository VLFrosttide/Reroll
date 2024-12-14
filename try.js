GetIconPath: (callback) => {
  console.log("Setting up IPC listener for GetIconPath");
  ipcRenderer.on("GetIconPath", (event, data) => {
    console.log("Preload received: ", data);
    if (callback) callback(event, data); // If callback exists, call it
  });
};
