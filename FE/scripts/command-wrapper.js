const path = require('path');
const execSync = require('child_process').execSync;
const commandParameters = require('./command-parameters');

const argv = process.argv.slice(2);

console.log('[command-wrapper] Sent command:      ' + argv.join(' '));

const position = argv.indexOf('--');
const commands = argv.slice(0, position >= 0 ? position : argv.length);
const parameters = argv.slice(position >= 0 ? (position + 1) : argv.length).reduce((parameters, option) => {
    const position = option.indexOf('=');
    parameters[option.slice(0, position >= 0 ? position : option.length)] = option.slice(position >= 0 ? (position + 1) : option.length);
    return parameters;
}, {});

console.log('[command-wrapper] Real command:      ' + commands.join(' '));
console.log('[command-wrapper] Parameters:        ' + JSON.stringify(parameters));

const projectDirectory = path.resolve(__dirname, '../');
commandParameters.saveParameters(projectDirectory, parameters);

if (commands.length > 0) {
    const commandPath = execSync('where ' + commands[0]).toString().trim().split('\n')[0];
    execSync(['"' + commandPath + '"', ...commands.slice(1)].join(' '), { stdio: 'inherit' });
}
