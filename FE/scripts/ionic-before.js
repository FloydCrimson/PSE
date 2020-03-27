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
    { parameters: ['--environment-extra', '--env-ex'], path: path.join(projectDirectory, 'src', 'environments', 'environment-extra.json') },
    { parameters: ['--domain-extra', '--dom-ex'], path: path.join(projectDirectory, 'src', 'domains', 'domain-extra.json') }
];
for (const extra of extras) {
    for (const parameter of extra.parameters) {
        if (parameter in parameters) {
            let config = {};
            try {
                config = JSON.parse(parameters[parameter]);
            } catch (error) {
                console.warn('[ionic-before] unable to parse "' + parameter + '" json:   ' + parameters[parameter]);
            }
            fs.writeFileSync(extra.path, JSON.stringify(config, undefined, '\t'));
        }
    }
};
