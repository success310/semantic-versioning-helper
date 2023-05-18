import { PredefinedFile } from "./types";
import { buildRegexString, versionRegexString } from "./constants";

export function regexFrom(
  file: PredefinedFile,
  index?: "2" | "3" | "4" | "5"
): RegExp | false {
  if (index) {
    if (`regex${index}` in file) {
      const regString = file[`regex${index}`];
      if (regString)
        return new RegExp(
          regString
            .replace("[version]", versionRegexString)
            .replace("[build]", buildRegexString)
        );
    }
    return false;
  }
  return new RegExp(
    file.regex
      .replace("[version]", versionRegexString)
      .replace("[build]", buildRegexString)
  );
}
