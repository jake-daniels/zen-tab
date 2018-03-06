
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')

const APP_DIRECTORY = fs.realpathSync(process.cwd())

const resolvePath = (relativePath) => {
	return path.resolve(APP_DIRECTORY, relativePath)
}

const copy = (src, dest, filter) => {
    const srcPath = resolvePath(src)
    const destPath = resolvePath(dest)
    fs.copySync(srcPath, destPath, {
        clobber: true,
        dereference: true,
        preserveTimestamps: false,
        filter: filter,
    })
}

const getNewRelease = (version, release) => {
    let [major, minor, fix] = version.split('.')

    if (release === 'fix' || release === undefined) {
        fix = (parseInt(fix) + 1).toString()
    }

    if (release === 'minor') {
        minor = (parseInt(minor) + 1).toString()
        fix = '0'
    }

    if (release === 'major') {
        major = (parseInt(major) + 1).toString()
        minor = '0'
        fix = '0'
    }

    return [major, minor, fix].join('.')
}

const updateVersion = () => {
    console.log('  Updating manifest version...')

    const release = process.argv[2]
    const manifestPath = resolvePath('extension/manifest.json')
    const manifest = fs.readJsonSync(manifestPath)
    manifest.version = getNewRelease(manifest.version, release)
    fs.writeJsonSync(manifestPath, manifest, {spaces: 4})

    return manifest.version
}

const createDirectories = () => {
    console.log('  Creating directories...')

    fs.emptyDirSync(resolvePath('build-ext'))
    fs.mkdirsSync(resolvePath('build-ext/core'))
    fs.mkdirsSync(resolvePath('build-ext/resources'))
}

const copyAllFiles = () => {
    console.log('  Copying files...')

    copy('extension', 'build-ext/resources', (file) => (file !== resolvePath('extension/manifest.json')))
    copy('extension/manifest.json', 'build-ext/manifest.json')
    copy('build', 'build-ext/core')
}

const updatePaths = () => {
    // index.html
    console.log('  Updating paths in index.html...')

    const indexPath = resolvePath('build-ext/core/index.html')
    const indexData = fs.readFileSync(indexPath, {encoding: 'utf8'})
    const newIndexData = indexData
        .replace(/static/g, 'core/static')
        .replace(/favion/g, 'core/favicon')
    fs.writeFileSync(indexPath, newIndexData, {encoding: 'utf8'})

    // main.js
    console.log('  Updating paths in main.js...')

    const manifestPath = resolvePath('build-ext/core/asset-manifest.json')
    const manifestData = fs.readJsonSync(manifestPath)
    const mainPath = resolvePath(`build-ext/core/${manifestData['main.js']}`)
    const mainData = fs.readFileSync(mainPath, {encoding: 'utf8'})
    const newMainData = mainData.replace(/static/g, 'core/static')
    fs.writeFileSync(mainPath, newMainData, {encoding: 'utf8'})
}

const createPackage = () => {
    console.log('  Creating ZIP package...')

    const inputPath = resolvePath('build-ext/')
    const outputPath = resolvePath('zen-tab.zip')

    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', {zlib: {level: 9}})
    archive.pipe(output)
    archive.directory(inputPath, false)
    archive.finalize()
}


console.log('-------------------------- [ZEN TAB EXTENSION BUILD] --------------------------')
console.log()

let releaseVersion = 'unknown'
try {
    releaseVersion = updateVersion()
    createDirectories()
    copyAllFiles()
    updatePaths()
    createPackage()
} catch (err) {
    console.error(err)
    process.exit(1)
}

console.log()
console.log(chalk.yellow(`  Zen Tab [version ${releaseVersion}] has been built successfully.`))
console.log()
console.log('-------------------------------------------------------------------------------')
console.log()
