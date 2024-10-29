import { exec, spawn } from "child_process";
import { WriteToLog } from "./LogFiles.js";
export function CheckPyPackage(PackageName, LogFilePath) {
  exec(`pip show ${PackageName}`, (error, stdout, stderr) => {
    if (error || stderr) {
      WriteToLog(LogFilePath, `${PackageName} not found`);
      if (
        error.includes("WARNING: Package(s) not found:") ||
        stderr.includes("WARNING: Package(s) not found:")
      ) {
        WriteToLog(LogFilePath, `attempting to install ${PackageName}... `);
        exec(
          `pip install ${PackageName}`,
          (installError, installStdout, installStderr) => {
            if (installError || installStderr) {
              WriteToLog(
                logfile,
                `Error installing ${PackageName}: ${
                  installError || installStderr
                }`
              );
            } else {
              WriteToLog(
                LogFilePath,
                `${PackageName} has been installed successfully`
              );
            }
          }
        );
      }
      return;
    }
    if (stdout.includes("Version")) {
      WriteToLog(LogFilePath, `${PackageName} is already installed`);
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
