const path = require('path');
const fs = require('fs');

module.exports = function (context) {
    const projectDirectory = path.resolve(__dirname, '../');

    // HAPI PATCHER

    const packageLocation = path.resolve(projectDirectory, 'node_modules', '@hapi', 'hawk', 'package.json');
    if (fs.existsSync(packageLocation)) {
        const package = require(packageLocation);
        package.main = 'lib/browser.js';
        // package.dependencies = {};
        // package.devDependencies = {};
        fs.writeFileSync(packageLocation, JSON.stringify(package, null, '  '));
    } else {
        console.warn('[ionic-before] package.json not found:   ' + packageLocation);
    }

    //
};
