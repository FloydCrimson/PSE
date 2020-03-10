const path = require('path');
const webpack = require('webpack');
const commandParameters = require('../scripts/command-parameters');

module.exports = (config, options) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(path.join(projectDirectory, 'config'));

    const placeholder = '{{ALIAS}}';
    const aliases = [
        { parameter: '--country', alias: '@countries', url: `countries/${placeholder}` },
        { parameter: '--environment', alias: '@environments', url: `environments/${placeholder}` },
        { parameter: '--domain', alias: '@domains', url: `domains/${placeholder}` }
    ];
    for (const alias of aliases) {
        if (alias.parameter in parameters) {
            config.resolve.alias[alias.alias] = alias.url.replace(placeholder, parameters[alias.parameter]);
        }
    };

    return config;
};
