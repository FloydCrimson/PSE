const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const commandParameters = require('./command-parameters');

module.exports = function (context) {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    // COMMAND INTEGRATION

    let platform = 'browser';
    if (context.name === 'serve:before') {
        platform = context.serve.platform || platform;
    } else if (context.name === 'build:before') {
        platform = context.build.platform || platform;
    }
    parameters['--platform'] = platform;
    commandParameters.saveParameters(projectDirectory, parameters);

    // FFMPEG.JS BROWSERIFY

    const ffmpegLocation = path.resolve(projectDirectory, 'node_modules', 'ffmpeg.js', 'ffmpeg-mp4.js');
    const ffmpegDestination = path.resolve(projectDirectory, 'libraries', 'ffmpeg.browser.js');
    const ffmpegName = 'ffmpeg';
    if (fs.existsSync(ffmpegLocation)) {
        if (!fs.existsSync(ffmpegDestination)) {
            console.warn('[ionic-before] ffmpeg.browser.js not found. Generating...');
            const commandPath = execSync('where browserify').toString().trim().split('\n')[0];
            execSync(['"' + commandPath + '"', '"' + ffmpegLocation + '"', '-o', '"' + ffmpegDestination + '"', '-s', ffmpegName].join(' '), { stdio: 'inherit' });
        }
    } else {
        console.warn('[ionic-before] ffmpeg-mp4.js not found:   ' + ffmpegLocation);
    }

    // HAPI PATCHER

    const packageLocation = path.resolve(projectDirectory, 'node_modules', '@hapi', 'hawk', 'package.json');
    if (fs.existsSync(packageLocation)) {
        const package = require(packageLocation);
        package.main = 'lib/browser.js';
        // package.dependencies = {};
        // package.devDependencies = {};
        fs.writeFileSync(packageLocation, JSON.stringify(package, undefined, '  '));
    } else {
        console.warn('[ionic-before] package.json not found:   ' + packageLocation);
    }

    // EXTRA CONFIG

    const extras = [
        { parameters: ['--environment-extra', '--env-ex'], path: path.join(projectDirectory, 'src', 'environments', 'environment-extra.json') },
        { parameters: ['--domain-extra', '--dom-ex'], path: path.join(projectDirectory, 'src', 'domains', 'domain-extra.json') }
    ];
    extras.forEach((extra) => {
        let found = false;
        let value = parameters[extra.parameters.find((p) => parameters[p])];
        if (value) {
            try {
                const config = JSON.parse(value);
                fs.writeFileSync(extra.path, JSON.stringify(config, undefined, '\t'));
                found = true;
            } catch (error) {
                console.warn('[ionic-before] unable to write "' + parameter + '" into json:   ' + value);
                console.warn('[ionic-before] error:   ' + JSON.stringify(error));
            }
        }
        if (!found) {
            fs.writeFileSync(extra.path, JSON.stringify({}, undefined, '\t'));
        }
    });

    // TSCONFIG

    const tsconfigs = [
        { parameters: ['--country', '--co'], prefix: 'src/countries/', suffix: '/**/*.ts' },
        { parameters: ['--domain', '--dom'], prefix: 'src/domains/', suffix: '/**/*.ts' },
        { parameters: ['--environment', '--env'], prefix: 'src/environments/', suffix: '/**/*.ts' },
        { parameters: ['--platform', '--plt'], prefix: 'src/platforms/', suffix: '/**/*.ts' }
    ];
    const tsconfigAppDirectory = path.resolve(projectDirectory, 'tsconfig.app.json');
    const tsconfigAppJSON = JSON.parse(fs.readFileSync(tsconfigAppDirectory).toString());
    tsconfigs.forEach((tsconfig) => {
        const value = parameters[tsconfig.parameters.find((p) => parameters[p])];
        if (value) {
            const regex = new RegExp('^(' + tsconfig.prefix.replace(/\/|\*/g, (c) => '\\' + c) + ').+(' + tsconfig.suffix.replace(/\/|\*/g, (c) => '\\' + c) + ')$');
            const common = tsconfig.prefix + 'common' + tsconfig.suffix;
            const alias = tsconfig.prefix + value + tsconfig.suffix;
            tsconfigAppJSON.include = tsconfigAppJSON.include.filter((i) => !(regex.test(i) && i !== common));
            tsconfigAppJSON.include.push(alias);
        }
    });
    tsconfigAppJSON.include.sort();
    const tsconfigAppCustomDirectory = path.resolve(projectDirectory, 'tsconfig.app.custom.json');
    fs.writeFileSync(tsconfigAppCustomDirectory, JSON.stringify(tsconfigAppJSON, undefined, '\t'));

    //
};
