import { app, ipcMain } from "electron";
import { win } from "../main.js";
import { WriteToLog } from "./LogFiles.js";
import { spawn } from "child_process";

import path from "path";
import { write } from "fs";
const DocPath = app.getPath("documents");
const RerollFolder = path.join(DocPath, "RerollLogs");
let LogFilePath = path.join(RerollFolder, "/Logs.txt");
let ExePath = app.getPath("exe");
ExePath = ExePath.substring(0, ExePath.lastIndexOf("\\"));
let LiftKeysPath = path.join(ExePath, "/python/LiftKeys.py");

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
    let PrintThis = String(data);
    console.log("MyData:", PrintThis);
    if (PrintThis.includes("MyCounter")) {
      win.webContents.send("Counter", "awd");
    }
    if (PrintThis.includes("CurrentBase")) {
      WriteToLog(
        LogFilePath,
        "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
      );

      WriteToLog(LogFilePath, PrintThis);
    }
    if (PrintThis.includes("Matching Line")) {
      // win.webContents.send("Match");
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
    console.error("error: ", String(data));
    let FailSafeArray = [
      "failSafeCheck",
      "fail-safe",
      "mouse moving to a corner",
      "FailSafeException",
      "FAILSAFE",
    ];
    let MyError = `Error with crafting: ${String(data)}`;
    WriteToLog(LogFilePath, `MyError: ${MyError}`);

    if (!FailSafeArray.some((element) => MyError.includes(element))) {
      WriteToLog(LogFilePath, `${MyError}`);
      win.webContents.send("ItemError", MyError);
    }
  });

  StartCrafting.on("exit", (code, signal) => {
    const LiftKeys = spawn("python", [LiftKeysPath]);
    LiftKeys.stderr.on("data", (data) => {
      console.error("Error with liftkeys: ", String(data));
      WriteToLog(LogFilePath, `${String(data)}`);
    });

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

    WriteToLog(
      LogFilePath,
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    );
  });
});
