/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { checkArgs } from "./argparse";
import chalk from "chalk";
import { determineVersion } from "./fileReader";
import { currentPath } from "./constants";

const fs = require("fs");

const argv = checkArgs();
if (argv) {
  console.log(`Project Path: ${currentPath}`);
  determineConfig().then((defaultConfig) => {
    let config = defaultConfig;
    determineVersion().then(([version, build]) => {
      if (argv.template) config = configFromTemplate(argv.template);
      if (argv.current) {
        console.log(
          `Current project version: ${chalk.bold(version)} ${chalk.bold(build)}`
        );
      } else {
        let newVersion = false;
        if (argv.new) newVersion = incrVersion(version, "CUSTOM", argv.new);
        else if (argv.major) newVersion = incrVersion(version, "MAJOR");
        else if (argv.minor) newVersion = incrVersion(version, "MINOR");
        else if (argv.patch) newVersion = incrVersion(version, "PATCH");
        if (newVersion) replaceFiles(config, version, newVersion, build);
        else error("At least one versioning arguments is required");
      }
    });
  });
}

function incr(newVersion) {
  fs.readFile("./package.json", "utf8", (err1, content) => {
    if (!err1) {
      const replaced = content.replaceAll(
        packageJsonVersionRegex,
        `"version": "${newVersion}",`
      );
      fs.writeFile("./package.json", replaced, (err2) => {
        if (!err2) {
          undoQueue.push({ file: "./package.json", content });
          fs.readFile(
            "./src/views/Components/Sidebar/index.tsx",
            "utf8",
            (err5, content2) => {
              if (!err5) {
                const regex2 = /v[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/g;
                const replaced2 = content2.replaceAll(regex2, `v${newVersion}`);
                fs.writeFile(
                  "./src/views/Components/Sidebar/index.tsx",
                  replaced2,
                  (err7) => {
                    if (!err7) {
                      undoQueue.push({
                        file: "./src/views/Components/Sidebar/index.tsx",
                        content: content2,
                      });
                      fs.readFile(
                        "./public/service-worker.js",
                        "utf8",
                        (err6, content3) => {
                          if (!err6) {
                            const replaced3 = content3.replaceAll(
                              regex2,
                              `v${newVersion}`
                            );
                            fs.writeFile(
                              "./public/service-worker.js",
                              replaced3,
                              (err8) => {
                                if (!err8) {
                                  console.log(`Success: ${newVersion}`);
                                  process.exit(0);
                                } else
                                  error(
                                    "./public/service-worker.js not writable!"
                                  );
                              }
                            );
                          } else error("./public/service-worker.js not found!");
                        }
                      );
                    } else
                      error(
                        "./src/views/Components/Sidebar/index.tsx not writable!"
                      );
                  }
                );
              } else
                error("./src/views/Components/Sidebar/index.tsx not found!");
            }
          );
        } else error("package.json not writable!");
      });
    } else error("No package.json found!");
  });
}
