# Gulp File

## Requirements

* Node.js > 6.9
* Gulp.js > 3.9 

## How to use
Copy this folder into the same directory with your theme. [Install](#install) all the denpendencies. Then you need to update the theme name in `gulpfile.js`
```javascript
...
  var themename = 'Your-Theme-Name'
...
```

And [Browsersync](#browsersync) config to your choice.

From the command line on your host machine, navigate to the gulp-dev directory then run
```
$ gulp
```

If you are using VS Code you can use builtin gulp-task

> You can run your task through Quick Open (⌘P) by typing 'task', Space and the command name. 

Please refer to [VS Code documentation](https://code.visualstudio.com/docs/editor/tasks#_binding-keyboard-shortcuts-to-tasks) for more details.

### <a name="install"></a>Install dependencies

From the command line on your host machine, navigate to the `gulp-dev` directory then run

```shell
$ npm install
```

## Build Commands
* `gulp styles` — Compile, autoprefix and minify Sass files.
* `gulp scripts` — Minify javascript files.
* `gulp images` — Compress and optimize images.
* `gulp watch` — Compile assets and watch file changes with Browsersync
* `gulp` — (Default task) runs all of the above tasks.

### Additional commands
* `gulp i18n` — Scan the theme and create POT file.
* `gulp zip` — Package theme into zip file for distribution.
* `gulp bump` - Bumps version number in all files. See options below.
  - `--major` version when you make incompatible API changes
  - `--minor` version when you add functionality in a backwards-compatible manner
  - `--patch` version when you make backwards-compatible bug fixes
  - `--to` allows you to define a custom version number, e.g. `gulp bump --to 0.1.0`

## <a name="browsersync"></a>Using Browsersync
To use Browsersync you need to update the proxy URL in `gulpfile.js` under `watch` task to reflect your local development hostname.

If your local development URL is `my-site`, update the file to read:

```javascript
...
  proxy: 'localhost/my-site',
...
```

You can also update to use your favorious browser. For instance, I'm using Firefox Developer on Mac OS so I need to update the path to my app under applications folder. For more information check out [BrowserSync documentation](https://browsersync.io/docs/options#option-browser)

```javascript
...
browser: '/Applications/Firefox\ Developer\ Edition.app'
...
```

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.