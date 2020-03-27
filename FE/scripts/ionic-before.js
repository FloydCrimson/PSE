const path = require('path');
const fs = require('fs');
const commandParameters = require('./command-parameters');

const projectDirectory = path.resolve(__dirname, '../');
const parameters = commandParameters.loadParameters(path.join(projectDirectory, 'config'));

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
    { parameter: '--environment-extra', path: path.join(projectDirectory, 'src', 'environments', 'common', 'extra', 'environment.json') },
    { parameter: '--domain-extra', path: path.join(projectDirectory, 'src', 'domains', 'common', 'extra', 'domain.json') }
];
for (const extra of extras) {
    if (extra.parameter in parameters) {
        let config = {};
        try {
            config = JSON.parse(parameters[extra.parameter]);
        } catch (error) {
            console.warn('[ionic-before] unable to parse "' + extra.parameter + '" json:   ' + parameters[extra.parameter]);
        }
        fs.writeFileSync(extra.path, JSON.stringify(config, undefined, '\t'));
    }
};
