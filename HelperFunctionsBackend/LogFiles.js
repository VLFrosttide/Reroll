import fs from "fs";
import { exec } from "child_process";

export function WriteToFile(FilePath, StringToWrite) {
  fs.appendFileSync(FilePath, StringToWrite + "\n");
}

export function CreateLogFolder(FolderPath, DocPath) {
  if (!fs.existsSync(FolderPath)) {
    fs.mkdirSync(FolderPath, { recursive: true });
  }
}

export function OpenFile(FilePath) {
  exec(`start "" "${FilePath}"`);
}

export function DeleteFileContent(FilePath) {
  fs.writeFileSync(FilePath, "");
}
/**
 *
 * @param {string} FilePath
 * @param {Array<string>} Pmods
 * @param {Array<string>} Nmods
 */
export function ExportItemToFile(FilePath, Pmods, Nmods) {
  for (let i = 0; i < Pmods.length; i++) {
    WriteToFile(FilePath, Pmods[i]);
  }
  WriteToFile(FilePath, "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  for (let i = 0; i < Nmods.length; i++) {
    WriteToFile(FilePath, Nmods[i]);
  }
}
