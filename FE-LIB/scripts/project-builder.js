const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const argv = process.argv.slice(2);

const parentDirectory = path.resolve(argv[0]);
const parentReleaseDirectory = path.join(parentDirectory, 'releases');

// READ PARENT
const parentConfigPath = path.join(parentDirectory, 'angular.json');
console.log('[project-builder] reading parent project:   ' + parentConfigPath);
const parentConfigJSON = JSON.parse(fs.readFileSync(parentConfigPath).toString());
for (const project in parentConfigJSON.projects) {
    console.log('[project-builder] project found:   ' + project);
    // READ CHILD
    const childConfigPath = path.resolve(parentDirectory, parentConfigJSON.projects[project].architect.build.options.project);
    console.log('[project-builder] reading child project:   ' + childConfigPath);
    const childConfigJSON = JSON.parse(fs.readFileSync(childConfigPath).toString());
    // BUILD
    console.log('[project-builder] building...');
    execSync(['ng', 'build', project, '--configuration=prod'].join(' '), { stdio: 'inherit', cwd: parentDirectory });
    console.log('[project-builder] built.');
    // PACK
    console.log('[project-builder] packing...');
    const childReleaseDirectory = path.join(parentReleaseDirectory, project);
    const childDestDirectory = path.resolve(childConfigPath, '..', childConfigJSON.dest);
    if (!fs.existsSync(childReleaseDirectory)) {
        fs.mkdirSync(childReleaseDirectory, { recursive: true });
    }
    execSync(['npm', 'pack', childDestDirectory].join(' '), { stdio: 'inherit', cwd: childReleaseDirectory });
    console.log('[project-builder] packed.');
}
