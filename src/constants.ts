import { PredefinedFile } from "./types";
export const versionRegexString = "[0-9]{1,5}.[0-9]{1,5}.[0-9]{1,5}";
export const versionRegex = /[0-9]{1,5}.[0-9]{1,5}.[0-9]{1,5}/g;
export const buildRegexString = "[0-9]{1,10}.?[0-9]{1,10}.?[0-9]{1,10}";
export const buildRegex = /[0-9]{1,10}.?[0-9]{1,10}.?[0-9]{1,10}/g;

export const predefinedFiles: PredefinedFile[] = [
  {
    identifier: "package.json",
    path: "/package.json",
    regex: '"version": "[version]"',
  },
  {
    identifier: "readme",
    path: "/readme.md",
    regex: "[version]",
  },
  {
    identifier: "service-worker",
    path: "/public/service-worker.js",
    regex: "v[version]",
  },
  {
    identifier: "ios",
    path: "/ios/*.xcodeproj/project.pbxproj",
    regex: "CURRENT_PROJECT_VERSION = [build];",
    regex2: "MARKETING_VERSION = [version];",
  },
  {
    identifier: "android",
    path: "/android/app/build.gradle",
    regex: '"version": "[version]"',
    regex2: '"dist": "[build]"',
  },
];

export type ConfigFile = {
  template: string;
  files: string[];
  excludedFiles: string[];
  customFiles: PredefinedFile[];
};

export type Config = {
  files: PredefinedFile[];
};

export const currentPath = process.cwd();
