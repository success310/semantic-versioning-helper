export type PredefinedIdentifier =
  | "package.json"
  | "readme"
  | "service-worker"
  | "ios"
  | "android";

export type PredefinedFile = {
  identifier: PredefinedIdentifier;
  path: string;
  regex: string;
  regex2?: string;
  regex3?: string;
  regex4?: string;
  regex5?: string;
};

export type MODE = "MINOR" | "MAJOR" | "PATCH" | "CUSTOM";

export type UndoQueue = {
  file: string;
  content: string;
};
