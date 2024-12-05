import fs from "fs";
import { exec } from "child_process";

export function WriteToFile(LogFile, StringToWrite) {
  fs.appendFileSync(LogFile, StringToWrite + "\n");
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
