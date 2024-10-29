import fs from "fs";
import { exec } from "child_process";

export function WriteToLog(LogFile, StringToWrite) {
  fs.appendFileSync(LogFile, StringToWrite + "\n");
}

export function CreateLogs(FolderPath, DocPath) {
  if (!fs.existsSync(FolderPath)) {
    fs.mkdirSync(FolderPath, { recursive: true });
  }
}

export function OpenFile(FilePath) {
  exec(`start "" "${FilePath}"`);
}

export function Deletefile(LogfilePath) {
  fs.unlinkSync(FilePath);
}
