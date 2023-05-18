import fs from "fs";
import { error } from "./argparse";
import { currentPath, predefinedFiles, versionRegex } from "./constants";
import { join } from "./path";
import chalk from "chalk";
import { regexFrom } from "./regexBuilder";

export function determineVersion() {
  return new Promise<string[]>((resolve, reject) => {
    const pkgJson = predefinedFiles[0];
    const pkgJsonRegex = regexFrom(pkgJson);
    if (pkgJsonRegex) {
      readFile(pkgJson.path).then((content) => {
        const match = content.match(pkgJsonRegex);
        if (match && match.length) {
          const v = match[0].match(versionRegex);
          if (v && v.length) {
            resolve([v[0], ""]);
          }
        } else {
          reject();
        }
      }, error);
    } else {
      error("Unexpected error occurred 0x0001");
    }
  });
}

export function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(join(currentPath, path), "utf8", (err, content) => {
      if (!err) {
        resolve(content);
      } else {
        reject(`File ${chalk.bold(path)} not found!`);
      }
    });
  });
}
