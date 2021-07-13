const path = require('path');
const commandParameters = require('./command-parameters');

module.exports = (config, options, targetOptions) => {
    const projectDirectory = path.resolve(__dirname, '../');
    const parameters = commandParameters.loadParameters(projectDirectory);

    // FALLBACK

    const fallbackArray = [
        { fallback: 'crypto', value: require.resolve('crypto-browserify') },  // @Hapi
        { fallback: 'stream', value: require.resolve('stream-browserify') }   // @Hapi
    ];
    config.resolve.fallback = fallbackArray.reduce((fallback, value) => Object.assign(fallback, { [value.fallback]: value.value }), config.resolve.fallback || {});

    //

    return config;
};
