const path = require('path');
const fs = require('fs');
const commandParameters = require('./command-parameters');

const addUnoverwritableParameters = (context) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    const optionsMap = new Map([
        ['serve:before', { options: 'serve' }],
        ['build:before', { options: 'build' }]
    ]);
    const options = optionsMap.has(context.name) ? context[optionsMap.get(context.name).options] : {};

    let update = false;
    if (options['platform']) {
        parameters['platform'] = options['platform'];
        update = update || true;
    }
    if (options['configuration']) {
        parameters['environment'] = options['configuration'].split(',').includes('production') ? 'prod' : 'dev';
        update = update || true;
    }
    if (options['configuration']) {
        const countries = ['it', 'en'];
        const found = options['configuration'].split(',').filter((configuration) => countries.includes(configuration));
        if (found.length > 1) {
            throw '[ionic-before] Multiple values for alias "country" found in --configuration.';
        }
        if (found.length > 0) {
            parameters['country'] = found[0];
            update = update || true;
        }
    }
    if (update) {
        commandParameters.saveParameters(projectDirectory, parameters);
    }
};

const patchHapiLibrary = (context) => {
    const projectDirectory = path.resolve(__dirname, '../');

    const packageLocation = path.resolve(projectDirectory, 'node_modules', 'hawk', 'package.json');
    if (fs.existsSync(packageLocation)) {
        const package = require(packageLocation);
        package.main = 'lib/browser.js';
        // package.dependencies = {};
        // package.devDependencies = {};
        fs.writeFileSync(packageLocation, JSON.stringify(package, undefined, '\t'));
    } else {
        console.warn('[ionic-before] package.json not found:   ' + packageLocation);
    }
};

const createParametersExtraJSON = (context) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    const tsconfigArray = [
        { alias: 'country', prefix: 'src/countries/', suffix: '/**/*.ts' },
        { alias: 'domain', prefix: 'src/domains/', suffix: '/**/*.ts' },
        { alias: 'environment', prefix: 'src/environments/', suffix: '/**/*.ts' },
        { alias: 'platform', prefix: 'src/platforms/', suffix: '/**/*.ts' }
    ];
    const tsconfigDirectory = path.resolve(projectDirectory, 'tsconfig.app.json');
    const tsconfigJSON = JSON.parse(fs.readFileSync(tsconfigDirectory).toString());
    tsconfigArray.forEach((tsconfig) => {
        const value = parameters[tsconfig.alias];
        if (value) {
            const regex = new RegExp('^(' + tsconfig.prefix.replace(/\/|\*/g, (c) => '\\' + c) + ').+(' + tsconfig.suffix.replace(/\/|\*/g, (c) => '\\' + c) + ')$');
            const common = tsconfig.prefix + 'common' + tsconfig.suffix;
            const alias = tsconfig.prefix + value + tsconfig.suffix;
            tsconfigJSON.include = tsconfigJSON.include.filter((i) => !(regex.test(i) && i !== common));
            tsconfigJSON.include.push(alias);
        }
    });
    tsconfigJSON.include.sort();
    const tsconfigAppCustomDirectory = path.resolve(projectDirectory, 'tsconfig.app.custom.json');
    fs.writeFileSync(tsconfigAppCustomDirectory, JSON.stringify(tsconfigJSON, undefined, '\t'));
};

const createTSConfigCustomJSON = (context) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    const extraArray = [
        { alias: 'country-extra', path: path.join(projectDirectory, 'src', 'countries', 'country-extra.json') },
        { alias: 'environment-extra', path: path.join(projectDirectory, 'src', 'environments', 'environment-extra.json') },
        { alias: 'domain-extra', path: path.join(projectDirectory, 'src', 'domains', 'domain-extra.json') }
    ];
    extraArray.forEach((extra) => {
        let found = false;
        let value = parameters[extra.alias];
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
};

module.exports = (context) => {
    addUnoverwritableParameters(context);
    patchHapiLibrary(context);
    createParametersExtraJSON(context);
    createTSConfigCustomJSON(context);
};
