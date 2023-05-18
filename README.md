`semantic-versioning-helper` Helps manage the version of your project across multiple files. Works
after [Semantic Versioning 2.0.0](https://semver.org/) rules.

If you need to change the version number (x.x.x) and a build number across multiple files, this package does that with
just a single command.

Works best for react / react-native Projects

## Set-up

### npm

    npm i --dev semantic-versioning-helper

### yarn

    yarn add --dev semantic-versioning-helper

## Usage

`yarn semantic-versioning-helper <options>`

You can create a script in your `package.json`:

```
{
  ...
  "scripts": {
    ...
    "version": "yarn semantic-versioning-helper <YOUR-OPTIONS>"
  }
}
```

### Options

- `n [--new] x.x.x` Will change the version of your project to x.x.x
- `c [--current]` Print the current version of your project according to your package.json
- `h [--help]` Print Manual
- `t [--template]` define a template, see Configuration templates, this option will ignore your config file
- `p [--patch]` Patch version increase by 1 meaning 1.0.0 => 1.0.1
- `m [--minor]` Minor version increase by 1 meaning 1.0.0 => 1.1.0
- `M [--major]` Major version increase by 1 meaning 1.0.0 => 2.0.0

### Example

If you have no config file, `yarn semantic-versioning-helper n 1.0.2` will change your package.json from

```
{
  ...
  "version": "1.0.0",
  ...
}
```

to

```
{
...
"version": "1.0.2",
...
}
```

Exactly, `yarn semantic-versioning-helper p` would have the same effect in this case!

## Configuration

This package has some files built in, for example change the version of the package.json, build.gradle (react-native
android), project.pbxprj (react-native ios).

You can add a `.semverhelprc.js` config file to add every custom file you want.

#### Example:

```
module.exports = {
  template: "node",
  files: [
    "service-worker"
  ],
  excludedFiles: [
    "readme"
  ]
  customFiles: [
    {
      path: "/src/App.tsx",
      regex: "This project has the version [version][build].",
    }
  ]
};
```

### template: string

Different build in templates include some files. Those files will be changed to the new version.

Possible values:

- `default` <i>default</i>: `package.json` included
- `node`: `package.json`, `readme` included
- `react`: `package.json`, `readme`, `service-worker` included
- `react-native`: `package.json`, `readme`, `android`, `ios` included

### files: string[]

Adittionaly to the selected template include predefined files:
Predefined files:

- `package.json` will replace version in `/package.json`
- `service-worker` will replace in `/public/service-worker.js` the cache
  version (`/v[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}/g`)
- `readme` will look for occurrences of the current version name (determined by package.json) and replace them
- `android` replace version name in `/android/app/build.gradle` and increase build number by 1
- `ios` replace MARKETING_VERSION in `/ios/[YOUR_PROJECT].xcodeproj/project.pbxproj` and increase
  CURRENT_PROJECT_VERSION by 1

### excludedFiles: string[]

Exclude any predefined file from a template.

F.e. If you use react-native template for example but have no ios folder you need `ios` in `excludedFiles`, otherwise
the script will abort and undo all changes it made!

### customFiles: CustomFile[]

You can specify any other project specific file the script should change.
Example:

```
{
path: "/src/App.tsx",
regex: "This project has the version [version][build].",  
}
```

- `path`: obvious
- `regex`: Regular expression where [version] = current version, each match will be replaced with [version] containing
  the new Version. [build] will be increased by 1.
- `regex<2,3,4,5>`: You can give up to 5 different Regular expressions for each file

## Why use semantic-versioning-helper

Well I didn't find anything useful that does these things for me, especially releasing a new React-Native App version
was very tedious, going through all the files that needed version changes, and if you forget a file, after 2hrs build
time the App Store kindly informs you that an App with this version has already been released.. 🥲

## Isn't this dangerous?

Nope. If the script fails it undoes all changes it made!

## Contribute

I'm open to suggestions to improve this, open an issue or mail to [ivan@waldboth.com](mailto:ivan@waldboth.com).

Especially suggestions for file templates.

## Donate

<a href="https://paypal.me/knolperlap/"><img src="paypal.svg" height="40"></a>  
If you enjoyed this project — or just feeling generous, consider buying me a beer. Cheers! :beers:

## License

[MIT](https://opensource.org/license/mit/)
