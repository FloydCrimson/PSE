const fs = require('fs');

let errorInterfaceGeneratorModule = {};

errorInterfaceGeneratorModule.generate = function (parameters) {
    const { jsonPath, interfacePath, indentation } = { indentation: '\t', ...parameters };
    const jsonJSON = require(jsonPath);
    const interfaceStrings = [];
    const interfaceCategoriesStrings = [];
    const errorInterfaceName = 'ErrorImplementation';
    interfaceStrings.push(indentation.repeat(0) + 'export interface ' + errorInterfaceName + ' {');
    for (const category in jsonJSON.GATEGORIES) {
        const CATEGORY = jsonJSON.GATEGORIES[category];
        const interfaceCategoryStrings = [];
        const errorInterfaceCategoryName = 'ErrorCategory' + category.split('_').map((s) => s[0].toUpperCase() + s.substring(1).toLowerCase()).join('') + 'Implementation';
        interfaceStrings.push(indentation.repeat(1) + category + ': ' + errorInterfaceCategoryName + ';');
        interfaceCategoryStrings.push(indentation.repeat(0) + 'export interface ' + errorInterfaceCategoryName + ' {');
        for (const error in CATEGORY.ERRORS) {
            interfaceCategoryStrings.push(indentation.repeat(1) + error + ': { code: string; description: string; };');
        }
        interfaceCategoryStrings.push(indentation.repeat(0) + '}');
        interfaceCategoriesStrings.push(interfaceCategoryStrings);
    }
    interfaceStrings.push(indentation.repeat(0) + '}');
    fs.writeFileSync(interfacePath, [interfaceStrings, ...interfaceCategoriesStrings].map((a) => a.join('\n')).join('\n\n') + '\n');
}

module.exports = errorInterfaceGeneratorModule;

//

const path = require('path');

const projectDirectory = path.resolve(__dirname, '../');
errorInterfaceGeneratorModule.generate({ jsonPath: path.join(projectDirectory, 'src/protocols/database/assets/error.json'), interfacePath: path.join(projectDirectory, 'src/protocols/database/implementations/error.implementation.ts'), indentation: '    ' });
errorInterfaceGeneratorModule.generate({ jsonPath: path.join(projectDirectory, 'src/protocols/rest/assets/error.json'), interfacePath: path.join(projectDirectory, 'src/protocols/rest/implementations/error.implementation.ts'), indentation: '    ' });
errorInterfaceGeneratorModule.generate({ jsonPath: path.join(projectDirectory, 'src/protocols/socket/assets/error.json'), interfacePath: path.join(projectDirectory, 'src/protocols/socket/implementations/error.implementation.ts'), indentation: '    ' });
