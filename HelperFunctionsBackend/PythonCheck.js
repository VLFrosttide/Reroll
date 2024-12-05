import { exec, spawn } from "child_process";
import { WriteToFile } from "./LogFiles.js";
export function CheckPyPackage(PackageName, LogFilePath) {
  exec(`pip show ${PackageName}`, (error, stdout, stderr) => {
    if (error || stderr) {
      WriteToFile(LogFilePath, `${PackageName} not found`);
      if (
        error.includes("WARNING: Package(s) not found:") ||
        stderr.includes("WARNING: Package(s) not found:")
      ) {
        WriteToFile(LogFilePath, `attempting to install ${PackageName}... `);
        exec(
          `pip install ${PackageName}`,
          (installError, installStdout, installStderr) => {
            if (installError || installStderr) {
              WriteToFile(
                logfile,
                `Error installing ${PackageName}: ${
                  installError || installStderr
                }`
              );
            } else {
              WriteToFile(
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
      WriteToFile(LogFilePath, `${PackageName} is already installed`);
    }
  });
}

export function CheckPython(LogFilePath) {
  exec("python --version", (error, stdout, stderr) => {
    if (error) {
      WriteToFile(LogFilePath, error);
      return;
    }

    console.log(`Python is installed: ${stdout || stderr}`);
    WriteToFile(LogFilePath, `Python is installed: ${stdout || stderr}`);
  });
}
