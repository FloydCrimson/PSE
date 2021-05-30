const path = require('path');
const commandParameters = require('./command-parameters');

module.exports = (config, options) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    const placeholder = '{{ALIAS}}';
    const aliasArray = [
        { name: 'country', alias: '@countries', url: `countries/${placeholder}` },
        { name: 'platform', alias: '@platforms', url: `platforms/${placeholder}` },
        { name: 'environment', alias: '@environments', url: `environments/${placeholder}` },
        { name: 'domain', alias: '@domains', url: `domains/${placeholder}` }
    ];
    aliasArray.forEach((alias) => {
        config.resolve.alias[alias.alias] = alias.url.replace(placeholder, parameters[alias.name]);
    });

    return config;
};
