const parameterMap = new Map([
    ['country', { alias: ['--country', '--co'], overwrite: false, default: 'en', check: (value) => ['it', 'en'].includes(value) }],
    ['environment', { alias: ['--environment', '--env'], overwrite: false, default: 'dev', check: (value) => ['dev', 'prod'].includes(value) }],
    ['environment-extra', { alias: ['--environment-extra', '--env-ex'], overwrite: true, default: JSON.stringify({}), check: (value) => { try { JSON.parse(value); } catch (_) { return false; } return true; } }],
    ['domain', { alias: ['--domain', '--dom'], overwrite: true, default: 'localhost', check: (value) => ['localhost', 'localhost-s', 'localhost-android', 'localhost-android-s'].includes(value) }],
    ['domain-extra', { alias: ['--domain-extra', '--dom-ex'], overwrite: true, default: JSON.stringify({}), check: (value) => { try { JSON.parse(value); } catch (_) { return false; } return true; } }],
    ['platform', { alias: ['--platform', '--plt'], overwrite: false, default: 'browser', check: (value) => ['browser', 'android', 'ios'].includes(value) }]
]);

//

const path = require('path');
const fs = require('fs');

let commandParametersModule = {};

commandParametersModule.checkParameters = (parameters) => {
    let result = true;
    result = result && Object.keys(parameters).reduce((result, name) => {
        if (!parameterMap.has(name)) {
            console.warn('[command-parameters] Invalid alias found:   "' + name + '".');
            result = result && false;
        } else if (!parameterMap.get(name).check(parameters[name])) {
            console.warn('[command-parameters] Invalid value found for alias "' + name + '":   "' + parameters[name] + '".');
            result = result && false;
        }
        return result;
    }, true);
    result = result && Array.from(parameterMap.keys()).reduce((result, name) => {
        if (!(name in parameters)) {
            console.warn('[command-parameters] Missing alias found in parameters:   "' + name + '".');
            result = result && false;
        }
        return result;
    }, true);
    if (!result) {
        throw '[command-parameters] Parameters check failed!';
    }
};

commandParametersModule.parseParameters = (commands) => {
    const parameters = commands.reduce((parameters, command) => {
        const position = command.indexOf('=');
        const alias = command.slice(0, position >= 0 ? position : command.length);
        const name = Array.from(parameterMap.keys()).find((name) => parameterMap.get(name).alias.includes(alias));
        if (name) {
            const options = parameterMap.get(name);
            if (!options.overwrite) {
                console.warn('[command-parameters] Alias "' + alias + '" not overwritable. It will be ignored.');
            } else {
                const value = command.slice(position >= 0 ? (position + 1) : command.length);
                const result = options.check(value);
                if (result) {
                    parameters[name] = value;
                } else {
                    parameters[name] = options.default;
                    console.warn('[command-parameters] Invalid value found for alias "' + name + '":   "' + value + '". Default value will be added:   "' + parameters[name] + '".');
                }
            }
        } else {
            console.warn('[command-parameters] Alias "' + alias + '" not recognized. It will be ignored.');
        }
        return parameters;
    }, {});
    Array.from(parameterMap.keys()).filter((name) => !(name in parameters)).forEach((name) => {
        const options = parameterMap.get(name);
        parameters[name] = options.default;
        if (options.overwrite) {
            console.warn('[command-parameters] Missing alias found in parameters:   "' + name + '". Default value will be added:   "' + parameters[name] + '".');
        }
    });
    commandParametersModule.checkParameters(parameters);
    return parameters;
};

commandParametersModule.saveParameters = (directory, parameters) => {
    commandParametersModule.checkParameters(parameters);
    const parametersDirectory = path.join(directory, 'parameters.json');
    fs.writeFileSync(parametersDirectory, JSON.stringify(parameters, undefined, '\t'));
};

commandParametersModule.loadParameters = (directory) => {
    const parametersDirectory = path.join(directory, 'parameters.json');
    if (fs.existsSync(parametersDirectory)) {
        const parameters = JSON.parse(fs.readFileSync(parametersDirectory).toString());
        commandParametersModule.checkParameters(parameters);
        return parameters;
    } else {
        console.warn('[command-parameters] Directory "' + parametersDirectory + '" does not exist.');
        return {};
    }
};

module.exports = commandParametersModule;
