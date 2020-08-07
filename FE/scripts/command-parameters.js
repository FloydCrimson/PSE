const path = require('path');
const fs = require('fs');

let commandParametersModule = {};

commandParametersModule.saveParameters = function (directory, parameters) {
    const parametersDirectory = path.join(directory, 'parameters.json');
    fs.writeFileSync(parametersDirectory, JSON.stringify(parameters, undefined, '\t'));
}

commandParametersModule.loadParameters = function (directory) {
    const parametersDirectory = path.join(directory, 'parameters.json');
    if (fs.existsSync(parametersDirectory)) {
        return JSON.parse(fs.readFileSync(parametersDirectory).toString());
    } else {
        console.warn(parametersDirectory + ' does not exist.');
        return {};
    }
}

module.exports = commandParametersModule;
