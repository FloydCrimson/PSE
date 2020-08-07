const path = require('path');
const webpack = require('webpack');
const commandParameters = require('./command-parameters');

module.exports = (config, options) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    const placeholder = '{{ALIAS}}';
    const aliases = [
        { parameters: ['--country', '--co'], alias: '@countries', url: `countries/${placeholder}` },
        { parameters: ['--platform', '--plt'], alias: '@platforms', url: `platforms/${placeholder}` },
        { parameters: ['--environment', '--env'], alias: '@environments', url: `environments/${placeholder}` },
        { parameters: ['--domain', '--dom'], alias: '@domains', url: `domains/${placeholder}` }
    ];
    for (const alias of aliases) {
        for (const parameter of alias.parameters) {
            if (parameter in parameters) {
                config.resolve.alias[alias.alias] = alias.url.replace(placeholder, parameters[parameter]);
            }
        }
    };

    return config;
};
