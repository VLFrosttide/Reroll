import fs from "fs";

export function WriteToLog(LogFile, StringToWrite) {
  fs.appendFileSync(LogFile, StringToWrite + "\n");
}

export function CreateLogs(FolderPath, DocPath) {
  if (!fs.existsSync(FolderPath)) {
    fs.mkdirSync(FolderPath, { recursive: true });
  }
}
