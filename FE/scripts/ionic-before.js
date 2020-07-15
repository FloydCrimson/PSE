const path = require('path');
const fs = require('fs');
const commandParameters = require('./command-parameters');

module.exports = function (context) {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(path.join(projectDirectory, 'config'));

    // COMMAND INTEGRATION

    let platform = 'browser';
    if (context.name === 'serve:before') {
        platform = context.serve.platform || platform;
    } else if (context.name === 'build:before') {
        platform = context.build.platform || platform;
    }
    parameters['--platform'] = platform;
    commandParameters.saveParameters(path.join(projectDirectory, 'config'), parameters);

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
    for (const extra of extras) {
        let found = false;
        for (const parameter of extra.parameters) {
            if (parameter in parameters) {
                try {
                    const config = JSON.parse(parameters[parameter]);
                    fs.writeFileSync(extra.path, JSON.stringify(config, undefined, '\t'));
                    found = true;
                } catch (error) {
                    console.warn('[ionic-before] unable to write "' + parameter + '" into json:   ' + parameters[parameter]);
                    console.warn('[ionic-before] error:   ' + JSON.stringify(error));
                }
            }
        }
        if (!found) {
            fs.writeFileSync(extra.path, JSON.stringify({}, undefined, '\t'));
        }
    };

    //
};
