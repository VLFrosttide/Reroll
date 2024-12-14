import fs from "fs";
import { exec } from "child_process";
import Main from "electron/main";
import { resolve } from "path";

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

export function CheckFileExistence(FilePath) {
  return fs.existsSync(FilePath);
}

export function LoadItem(Item) {
  let LineArray = Item.split("\n");
  LineArray = LineArray.filter((item) => item !== "");
  let SplitIndex = LineArray.indexOf(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  );
  let Pmods = LineArray.slice(0, SplitIndex);
  let Nmods = LineArray.slice(SplitIndex + 1);
  return [Pmods, Nmods];
}

/**
 *
 * @param {string} LogfilePath
 * @param {string} FolderPath
 * @returns
 */
export async function ReadFolder(LogfilePath, FolderPath) {
  return new Promise((resolve, reject) => {
    console.log("FolderPath: ", FolderPath);
    fs.readdir(FolderPath, (err, files) => {
      if (err) {
        WriteToFile(LogfilePath, `Error reading SaveIcons folder:  ${err}`);
        reject(err);
      } else {
        let ImageExt = ["jpg", "png", "jpeg"];
        let ImageFiles = files.filter((file) => {
          const ext = ImageExt.includes(file.split(".").pop()?.toLowerCase());
          return ext;
        });
        WriteToFile(LogfilePath, `AllFiles: ${files}`);
        WriteToFile(LogfilePath, `ImageFiles:  ${ImageFiles}`);
        resolve(ImageFiles);
      }
    });
  });
}

export function CopyIcon(MainFilePath, IconName, IconFolderPath, LogfilePath) {
  return new Promise((resolve, reject) => {
    let NewLocation = IconFolderPath + "\\" + IconName;
    console.log("MainFilePath: ", MainFilePath);
    console.log("NewLocation: ", NewLocation);
    WriteToFile(LogfilePath, `MainFilePath: ${MainFilePath}`);
    WriteToFile(LogfilePath, `NewLocation: ${NewLocation}`);
    try {
      fs.copyFileSync(MainFilePath, NewLocation);
      resolve("Sucessfully imported all icons");
    } catch (err) {
      if (err) {
        let NewErr = new Error(`Failed to copy icons: ${err}`);
        reject(NewErr);
        WriteToFile(LogfilePath, `Error copying: ${err}`);
      }
    }
  });
}
