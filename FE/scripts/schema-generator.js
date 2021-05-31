const checkers = {
    'bigint': (value) => value !== null && value !== undefined,
    'boolean': (value) => value !== null && value !== undefined,
    'function': (value) => value !== null && value !== undefined,
    'number': (value) => value !== null && value !== undefined,
    'object': (value) => value !== null && value !== undefined && Object.keys(value).length > 0,
    'string': (value) => value !== null && value !== undefined && value.length > 0,
    'symbol': (value) => value !== null && value !== undefined,
    'undefined': (value) => value !== null && value !== undefined
};

const clean = (fileJSON) => {
    return Object.keys(fileJSON).reduce((obj, key) => checkers[typeof fileJSON[key]](fileJSON[key]) ? Object.assign(obj, { [key]: (typeof fileJSON[key] === 'object') ? clean(fileJSON[key]) : fileJSON[key] }) : obj, {});
};

const sort = (fileJSON) => {
    return Object.keys(fileJSON).sort().reduce((obj, key) => Object.assign(obj, { [key]: (typeof fileJSON[key] === 'object') ? sort(fileJSON[key]) : fileJSON[key] }), {});
};

const transform = (fileJSON, ...funcs) => {
    return funcs.filter(func => !!func).reduce((obj, func) => func(obj), fileJSON);
};

const generator = (fileJSON, schemaJSON) => {
    const type = typeof fileJSON;
    schemaJSON['type'] = type;
    if (type === 'object') {
        schemaJSON['additionalProperties'] = false;
        schemaJSON['properties'] = {};
        schemaJSON['required'] = [];
        for (const key in fileJSON) {
            schemaJSON['properties'][key] = {};
            schemaJSON['required'].push(key);
            generator(fileJSON[key], schemaJSON['properties'][key]);
        }
    }
};

//

const path = require('path');
const fs = require('fs');

const argv = process.argv.slice(2);

const cleaned = argv.includes('--cleaned');

const sorted = argv.includes('--sorted');

const filePath = argv[0];

const fileJSON = transform(JSON.parse(fs.readFileSync(filePath).toString()), cleaned && clean, sorted && sort);

const schemaPath = path.resolve(path.dirname(filePath), fileJSON['$schema']);

const schemaJSON = { '$schema': 'http://json-schema.org/draft-07/schema#' };

generator(fileJSON, schemaJSON);

fs.writeFileSync(filePath, JSON.stringify(fileJSON, undefined, '\t'));
fs.writeFileSync(schemaPath, JSON.stringify(schemaJSON, undefined, '\t'));
