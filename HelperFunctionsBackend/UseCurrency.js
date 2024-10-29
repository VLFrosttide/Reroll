import { spawn } from "child_process";
import { app, ipcMain } from "electron";
import { WriteToLog } from "./LogFiles.js";
import path from "path";
const DocPath = app.getPath("documents");
const RerollFolder = path.join(DocPath, "RerollLogs");
let LogFilePath = path.join(RerollFolder, "/Logs.txt");
let ExePath = app.getPath("exe");
ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));

ipcMain.on("TriggerCurrencyUse", (event, args) => {
  let CurrencyCoords = args[0];
  let ItemCoords = args[1];
  let TriggerCurrencyUsePath = path.join(ExePath, "/python/UseCurrency.py");

  const TriggerCurrencyUse = spawn("python", [
    TriggerCurrencyUsePath,
    CurrencyCoords,
    ItemCoords,
  ]);
  TriggerCurrencyUse.stdout.on("data", (data) => {
    console.log(String(data));
    WriteToLog(LogFile, String(data));
  });

  TriggerCurrencyUse.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    WriteToLog(LogFilePath, String(data));
  });

  TriggerCurrencyUse.on("close", (code) => {
    console.log(`UseCurrency child process exited with code ${code}`);
  });
});
