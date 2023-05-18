import minimist from "minimist";
import chalk from "chalk";
import { join } from "./path";
import fs from "fs";
import { UndoQueue } from "./types";

export function checkArgs() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["current", "help", "minor", "major", "patch", "version"],
    string: ["new", "template"],
  });
  console.log(
    chalk.bold("semantic-versioning-helper"),
    // tslint:disable-next-line:no-var-requires
    require(join(__dirname, "../package.json")).version
  );
  if (argv.version || argv.v) {
    // noop
  } else if (argv.help || argv.h) {
    printHelp();
  } else {
    return argv;
  }
  return false;
}

const undoQueue: UndoQueue[] = [];

export function error(msg: string) {
  console.log(`
      Error: ${chalk.red(msg)}
      
      Undo ${undoQueue.length} steps!
      ...
  `);
  undoQueue.forEach((action) => {
    fs.writeFile(action.file, action.content, "utf8", () => {
      console.log(`
       ${chalk.bold(action.file)} Restore original content
       `);
    });
  });
  setTimeout(() => {
    printHelp();
  }, 2000);
}

export function printHelp() {
  console.log(`
      Usage:
        yarn semantic-versioning-helper <options>
      
      Without arguments ${chalk.bold(
        "semantic-versioning-helper"
      )} will do nothing... I'm sorry!
       
      Options:
        
        ${chalk.bold("--new <x.x.x>")}
            increase version of your project to <x.x.x>
            
        ${chalk.bold("--current")}
            print current version of your project, determined by your package.json
            
        ${chalk.bold("--help")}
            print this Help
            
        ${chalk.bold("--template")}
            Use a template, this option will ignore your config file
            Different build in templates include some files. Those files will be changed to the new version.

            Possible values:
            
            - 'default' <i>default</i>: 'package.json' included
            - 'node': 'package.json', 'readme' included
            - 'react': 'package.json', 'readme', 'service-worker' included
            - 'react-native': 'package.json', 'readme', 'android', 'ios' included

        ${chalk.bold("--patch")}
            Patch version increase by 1, meaning 1.0.0 => 1.0.1

        ${chalk.bold("--minor")}
            Minor version increase by 1, meaning 1.0.7 => 1.1.0

        ${chalk.bold("--major")}
            Major version increase by 1, meaning 1.2.3 => 2.0.0
      `);
  process.exit(0);
}
