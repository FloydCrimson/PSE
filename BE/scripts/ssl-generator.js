const path = require('path');
const execSync = require('child_process').execSync;

const argv = process.argv.slice(2);

const parameters = argv.reduce((parameters, option) => {
    const position = option.indexOf('=');
    parameters[option.slice(0, position >= 0 ? position : option.length)] = option.slice(position >= 0 ? (position + 1) : option.length);
    return parameters;
}, {});

const selfSign = '--self-sign' in parameters;

const projectDirectory = path.resolve(__dirname, '../');
const sslDirectory = path.join(projectDirectory, 'ssl');

const commandPath = execSync('where openssl').toString().trim().split('\n')[0];
const keyPath = path.join(sslDirectory, 'pse.key');
const csrPath = path.join(sslDirectory, 'pse.csr');
const crtPath = path.join(sslDirectory, 'pse.crt');
const crtSignPath = path.join(sslDirectory, 'pse.sign.crt');
const reqPath = path.join(sslDirectory, 'req.conf');
const caPath = path.join(sslDirectory, 'ca.conf');
const caExtPath = path.join(sslDirectory, 'ca.ext.conf');

const commands = [];
commands.push(['"' + commandPath + '"', 'req', '-new', '-out', '"' + csrPath + '"', '-config', '"' + reqPath + '"']);
commands.push(['"' + commandPath + '"', 'req', '-new', '-x509', '-key', '"' + keyPath + '"', '-out', '"' + crtPath + '"']);
if (selfSign) {
    commands.push(['"' + commandPath + '"', 'ca', '-config', '"' + caPath + '"', '-out', '"' + crtSignPath + '"', '-extfile', '"' + caExtPath + '"', '-in', '"' + csrPath + '"']);
    commands.push(['"' + commandPath + '"', 'verify', '-CAfile', '"' + crtPath + '"', '"' + crtSignPath + '"']);
}

for (let i = 0; i < commands.length; i++) {
    const command = commands[i].join(' ');
    console.log('[SSL] ' + command);
    execSync(command, { stdio: 'inherit' });
}
