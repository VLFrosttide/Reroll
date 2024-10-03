import { exec, spawn } from "child_process";
import { WriteToLog } from "./LogFiles.js";
export function CheckPyPackage(PackageName, LogFilePath) {
  exec(`pip show ${PackageName}`, (error, stdout, stderr) => {
    if (error || stderr) {
      WriteToLog(
        LogFilePath,
        `Error checking package ${PackageName}: ${error || stderr}`
      );
      return;
    }
    if (stdout.includes("Version")) {
      WriteToLog(LogFilePath, `${PackageName} is already installed`);
    } else {
      WriteToLog(LogFilePath, `Installing ${PackageName}`);
      exec(
        `pip install ${PackageName}`,
        (installError, installStdout, installStderr) => {
          if (installError || installStderr) {
            WriteToLog(
              `Error installing ${PackageName}: ${
                installError || installStderr
              }`
            );
          } else {
            WriteToLog(LogFilePath, `${PackageName} has been installed.`);
          }
        }
      );
    }
  });
}

export function CheckPython(LogFilePath) {
  exec("python --version", (error, stdout, stderr) => {
    if (error) {
      WriteToLog(LogFilePath, error);
      return;
    }

    console.log(`Python is installed: ${stdout || stderr}`);
    WriteToLog(LogFilePath, `Python is installed: ${stdout || stderr}`);
  });
}
