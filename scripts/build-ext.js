
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

const APP_DIRECTORY = fs.realpathSync(process.cwd());
const resolvePath = (relativePath) => {
	return path.resolve(APP_DIRECTORY, relativePath);
}

const copy = (src, dest, filter) => {
    const srcPath = resolvePath(src);
    const destPath = resolvePath(dest);
    fs.copySync(srcPath, destPath, {
        clobber: true,
        dereference: true,
        preserveTimestamps: false,
        filter: filter
    });
}

console.log('-------------------------- [CHROME EXTENSION BUILD] --------------------------');
console.log();

console.log('  Creating directories...');

fs.emptyDirSync(resolvePath('build-ext'));
fs.mkdirsSync(resolvePath('build-ext/core'));
fs.mkdirsSync(resolvePath('build-ext/resources'));

console.log('  Copying files...');

copy('extension', 'build-ext/resources', (file) => (file !== resolvePath('extension/manifest.json')));
copy('extension/manifest.json', 'build-ext/manifest.json');
copy('build', 'build-ext/core');

console.log('  Updating index file...');

const indexHtml = resolvePath('build-ext/core/index.html')
fs.readFile(indexHtml, 'utf8', (err, data) => {

    if (err) {
        console.error(err);
        process.exit(1);
    }

    const result = data
        .replace(/static/g, 'core/static')
        .replace('/favicon', '/core/favicon');

    fs.writeFile(indexHtml, result, 'utf8', (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });

});

console.log(chalk.yellow('  Extension built successfully.'));

console.log();
console.log('------------------------------------------------------------------------------');
console.log();
