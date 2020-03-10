const path = require('path');
const fs = require('fs');

let commandParametersModule = {};

commandParametersModule.saveParameters = function (directory, parameters) {
    const configDirectory = path.join(directory, 'parameters.json');
    fs.writeFileSync(configDirectory, JSON.stringify(parameters, undefined, '\t'));
}

commandParametersModule.loadParameters = function (directory) {
    const configDirectory = path.join(directory, 'parameters.json');
    if (fs.existsSync(configDirectory)) {
        return JSON.parse(fs.readFileSync(configDirectory).toString());
    } else {
        console.warn(configDirectory + ' does not exist.');
        return {};
    }
}

module.exports = commandParametersModule;