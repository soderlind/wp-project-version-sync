# wp-project-version-sync

A CLI command to update your WordPress plugin, theme og json file header version based off of your `package.json` version.

wp-update-project-version is a CLI command that is most useful when added to your build script in your `package.json`.

## Usage

Only `package.json` is the supported `<source>` reference for a version. 

You can update one or more files, WordPress header files (plugin and `style.css`), `readme.txt` and `*.json` (eg block.json)  are supported.

Sync version number in `readme.txt`, `src/block.json` and `plugin.php` with the version number in `package.json`:


```json
{
    "scripts":  {
        "build": "npm run bump && wp-scripts build",
		"bump": "wp-update-project-version -s package.json -p readme.txt src/block.json plugin.php",
    }
}
```

## Installation

```
npm i @soderlind/wp-project-version-sync
```

## Credits

This is a fork of [wp-project-version-sync v1.1.0](https://github.com/masonitedoors/wp-project-version-sync) by @masonitedoors, see changelog for my changes.


## Changelog

### 2.0.0

- Update version number in more file types:
	- `Stable tag` in readme.txt
	- `"version"` in *.json (eg block.json)
- Update dependencies
- Update jest tests
	- Add tests for readme.txt and block.json.
	- Make it compatible with the updated dependencies.