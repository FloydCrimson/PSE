const path = require('path');
const execSync = require('child_process').execSync;

const argv = process.argv.slice(2);

const parameters = argv.reduce((parameters, option) => {
    const position = option.indexOf('=');
    parameters[option.slice(0, position >= 0 ? position : option.length)] = option.slice(position >= 0 ? (position + 1) : option.length);
    return parameters;
}, {});

const length = parameters['--length'] || '4096';
const days = parameters['--days'] || '365';
const subj = {
    C: parameters['--C'] || 'IT',
    ST: parameters['--ST'] || 'Italy',
    L: parameters['--L'] || 'Monza',
    O: parameters['--O'] || 'FloydCrimson',
    OU: parameters['--OU'] || 'PSE',
    CN: parameters['--CN'] || 'PSE',
    emailAddress: parameters['--emailAddress'] || 'floyd.crimson.cm@gmail.com'
};

const projectDirectory = path.resolve(__dirname, '../');
const sslDirectory = path.join(projectDirectory, 'ssl');

const commandPath = execSync('where openssl').toString().trim().split('\n')[0];
const keyPath = path.join(sslDirectory, 'ssl.key');
const crtPath = path.join(sslDirectory, 'ssl.crt');

const commands = [];
commands.push(['"' + commandPath + '"', 'req', '-x509', '-newkey', 'rsa:' + length, '-keyout', '"' + keyPath + '"', '-out', '"' + crtPath + '"', '-days', days, '-subj', '"' + Object.keys(subj).reduce((r, s) => r + '/' + s + '=' + subj[s], '') + '"']);

for (let i = 0; i < commands.length; i++) {
    const command = commands[i].join(' ');
    console.log('[SSL] ' + command);
    execSync(command, { stdio: 'inherit' });
}
