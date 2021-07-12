import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Cryptiles from '@hapi/cryptiles';
import * as Hawk from 'hawk';
import { CoderProvider, NonceProvider } from 'pse-global-providers';

import { HawkMethodImplementation, ParseRequestOptions, Artifacts, Credentials } from './hawk.implementation';

import { DispatcherService } from '../../../services/dispatcher.service';

export class HawkMethod implements HawkMethodImplementation {

    public static ATTEMPS_MAX: number = 3;

    constructor(
        private readonly dispatcherService: DispatcherService
    ) { }

    public async parseRequest(request: Hapi.Request, options: ParseRequestOptions): Promise<{ artifacts: Artifacts, credentials: Credentials }> {
        const artifacts = await this.getArtifacts(request, options);
        const credentials = await this.getCredentials(artifacts, options);
        return { artifacts, credentials };
    }

    public async decorateResponse(request: Hapi.Request, options: ParseRequestOptions): Promise<Hapi.ResponseObject> {
        const response = request.response as Hapi.ResponseObject;
        const { artifacts, credentials } = request.auth as unknown as { artifacts: Artifacts, credentials: Credentials };
        response.header('Access-Control-Expose-Headers', 'Server-Authorization');
        response.header('Server-Authorization', Hawk.server.header(credentials.user, artifacts, options));
        return response;
    }

    public async checkMac(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void> {
        if (!credentials.user.key || !credentials.user.algorithm) {
            throw Boom.boomify(new Error('Invalid credentials'), { decorate: { artifacts, credentials } });
        }
        if (Hawk.crypto.algorithms.indexOf(credentials.user.algorithm) === -1) {
            throw Boom.boomify(new Error('Unknown algorithm'), { decorate: { artifacts, credentials } });
        }
        const mac = Hawk.crypto.calculateMac('header', credentials.user, artifacts);
        if (!Cryptiles.fixedTimeComparison(mac, artifacts.mac)) {
            throw Object.assign(Hawk.utils.unauthorized('Bad mac'), { artifacts, credentials });
        }
    }

    public async checkPayload(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void> {
        if (!options.payload) {
            throw Object.assign(Hawk.utils.unauthorized('Missing required payload'), { artifacts, credentials });
        }
        if (!artifacts.hash) {
            throw Object.assign(Hawk.utils.unauthorized('Missing required payload hash'), { artifacts, credentials });
        }
        if (Hawk.crypto.algorithms.indexOf(credentials.user.algorithm) === -1) {
            throw Boom.boomify(new Error('Unknown algorithm'), { decorate: { artifacts, credentials } });
        }
        const hash = Hawk.crypto.calculatePayloadHash(options.payload, credentials.user.algorithm, artifacts.ct);
        if (!Cryptiles.fixedTimeComparison(hash, artifacts.hash)) {
            throw Object.assign(Hawk.utils.unauthorized('Bad payload hash'), { artifacts, credentials });
        }
    }

    public async checkNonce(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void> {
        if (!credentials.user.key) {
            throw Boom.boomify(new Error('Invalid credentials'), { decorate: { artifacts, credentials } });
        }
        if (!artifacts.nonce) {
            throw Object.assign(Hawk.utils.unauthorized('Missing required nonce'), { artifacts, credentials });
        }
        if (!artifacts.ts) {
            throw Object.assign(Hawk.utils.unauthorized('Missing required ts'), { artifacts, credentials });
        }
        try {
            await NonceProvider.check(credentials.user.key, artifacts.nonce, artifacts.ts);
        } catch (err) {
            throw Object.assign(Hawk.utils.unauthorized('Invalid nonce'), { artifacts, credentials });
        }
    }

    public async checkTimestamp(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void> {
        if (!artifacts.ts) {
            throw Object.assign(Hawk.utils.unauthorized('Missing required ts'), { artifacts, credentials });
        }
        if (Math.abs((artifacts.ts * 1000) - artifacts.tsn) > (artifacts.tsss * 1000)) {
            const tsm = Hawk.crypto.timestampMessage(credentials.user, options.localtimeOffsetMsec);
            throw Object.assign(Hawk.utils.unauthorized('Stale timestamp', tsm), { artifacts, credentials });
        }
    }

    //

    private async getArtifacts(request: Hapi.Request, options: ParseRequestOptions): Promise<Artifacts> {
        const tsss = options.timestampSkewSec || 60;
        const tsn = Hawk.utils.now(options.localtimeOffsetMsec);
        const parsed = Hawk.utils.parseRequest({ headers: request.headers, method: request.method, url: request.url.pathname }, options);
        const attributes = Hawk.utils.parseAuthorizationHeader(parsed.authorization, options.keys);
        const artifacts = { method: parsed.method, host: parsed.host, port: parsed.port, resource: parsed.url, ct: parsed.contentType, ts: parseInt(attributes.ts), tsss, tsn, nonce: attributes.nonce, hash: attributes.hash, ext: attributes.ext, app: attributes.app, dlg: attributes.dlg, mac: attributes.mac, id: attributes.id };
        if (['id', 'ts', 'nonce', 'hash', 'mac'].filter((key) => options.keys.includes(key)).some((key) => !artifacts[key])) {
            throw Boom.badRequest('Missing attributes', { decorate: { artifacts } });
        }
        return artifacts;
    }

    private async getCredentials(artifacts: Artifacts, options: ParseRequestOptions): Promise<Credentials> {
        const decoded = JSON.parse(CoderProvider.decode(artifacts.id));
        if ('id' in decoded || 'email' in decoded || 'nickname' in decoded) {
            try {
                const credentials = { user: await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', decoded, { relations: ['user'] }) };
                if (!credentials.user) {
                    throw Object.assign(Hawk.utils.unauthorized('Unknown credentials'), { artifacts });
                }
                return credentials;
            } catch (error) {
                throw Boom.boomify(error, { decorate: { artifacts } });
            }
        } else {
            throw Boom.badRequest('Missing attributes', { decorate: { artifacts } });
        }
    }

}
