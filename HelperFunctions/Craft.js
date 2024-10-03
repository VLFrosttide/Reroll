import { app, ipcMain } from "electron";
import { win } from "../main.js";
import { WriteToLog } from "./LogFiles.js";
import { spawn } from "child_process";

import path from "path";
const DocPath = app.getPath("documents");
const RerollFolder = path.join(DocPath, "RerollLogs");
let LogFilePath = path.join(RerollFolder, "/Logs.txt");
let ExePath = app.getPath("exe");
ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));

ipcMain.on("StartCrafting", (event, args) => {
  WriteToLog(LogFilePath, "Program started crafting");
  let ModName = args[0];
  let MaxRolls = args[1];
  let CurrencyCoords = args[2];
  let TabCoords = args[3];
  let CraftMaterial = args[4];
  let Fracture = args[5];
  let ExclusionMods = args[6];
  let RerollPath = path.join(ExePath, "/python/Reroll.py");
  console.log(MaxRolls);
  const StartCrafting = spawn("python", [
    RerollPath,
    ModName,
    MaxRolls,
    CurrencyCoords,
    TabCoords,
    CraftMaterial,
    Fracture,
    ExclusionMods,
  ]);

  StartCrafting.stdout.on("data", (data) => {
    console.log("MyData:", data.toString());

    WriteToLog(LogFilePathPath, String(data));
    let PrintThis = String(data);
    if (PrintThis.includes("Matching Line")) {
      win.webContents.send("Match");
      console.log("Print: ", PrintThis);
    }
    if (PrintThis.includes("RarityError")) {
      win.webContents.send(
        "RarityError",
        "The currency you're trying to use does not match the rarity of your item"
      );
    }
    if (PrintThis.includes("Item Not Found")) {
      console.log("Item not found: ");
      win.webContents.send("ItemError", "Item Not Found");
    }
  });

  StartCrafting.stderr.on("data", (data) => {
    console.error("error: ", data.toString());
    let MyError = `Error with crafting: ${String(data)}`;
    WriteToLog(LogFilePath, `${MyError}`);
    win.webContents.send("ItemError", MyError);
  });

  StartCrafting.on("exit", (code, signal) => {
    if (code !== null) {
      console.log(`Crafting script exited with code ${code}`);
      WriteToLog(LogFilePath, `Crafting script exited with code ${code}`);
    } else if (signal !== null) {
      console.log(`Crafting script was killed by signal ${signal}`);
      WriteToLog(LogFilePath, `Crafting script was killed by signal ${signal}`);
    } else {
      console.log("Crafting script has exited");
      WriteToLog(LogFilePath, "Crafting script has exited");
    }
  });
});
