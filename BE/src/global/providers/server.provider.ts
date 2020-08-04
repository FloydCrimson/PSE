import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

import { ProtocolConfigurationsType } from '../common/types/protocol-options.type';

export class ServerProvider {

    public static getServers(app: express.Express, configurations: ProtocolConfigurationsType[]): { instance: http.Server | https.Server, port: number }[] {
        return configurations.map((configuration) => {
            if (configuration.secure) {
                const options = {
                    key: configuration.key && fs.readFileSync(configuration.key),
                    cert: configuration.cert && fs.readFileSync(configuration.cert),
                    passphrase: configuration.passphrase
                };
                return { instance: https.createServer(options, app), port: configuration.port };
            } else {
                return { instance: http.createServer(app), port: configuration.port };
            }
        });
    }

}
