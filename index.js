/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const currentPath = process.cwd();
console.log(`Project Path: ${currentPath}`);
const versionRegex = "[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}";
const buildRegex = "[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}";
const files = [
  {
    identifier: "package.json",
    path: "/package.json",
    regex: '"version": "[verison]"',
  },
  {
    identifier: "service-worker",
    path: "/public/service-worker.js",
    regex: /v[version]/g,
  },
];

function checkArgs(args) {
  if (args.length < 3) return false;
  if (args.length > 4) return false;
  if (
    args[2] !== "n" &&
    args[2] !== "c" &&
    args[2] !== "-new" &&
    args[2] !== "--current"
  )
    return false;
  if ((args[2] === "n" || args[2] === "--new") && args.length < 4) return false;
  if (args[2] === "n" || args[2] === "--new") return 1;
  return 2;
}

function printManual() {
  console.log(process.argv);
  console.log("Command: node versionIncr.js <options>");
  console.log("Options:");
  console.log("\tn [--new] x.x.x\tincrease version of your project");
  console.log("\tc [--current]\tget current version of package.json");
  console.log("\th [--help]\tprint this Manual");
  process.exit(0);
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

const undoQueue = [];

function error(msg) {
  console.error(msg);
  console.log(`Undo ${undoQueue.length} steps!`);
  undoQueue.forEach((action) => {
    fs.writeFile(action.file, action.content).then();
  });
  setTimeout(() => {
    process.exit(1);
  }, 1000);
}

function get() {
  fs.readFile("./package.json", "utf8", (err1, content) => {
    if (!err1) {
      const match = content.match(packageJsonVersionRegex);
      console.log(match);
      process.exit(0);
    } else {
      error("No package.json found!");
    }
  });
}

const arg = checkArgs(process.argv);
switch (arg) {
  case 1:
    incr(process.argv[3]);
    break;
  case 2:
    get();
    break;
  default:
    printManual();
}
