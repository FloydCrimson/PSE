import * as Hapi from '@hapi/hapi';

import * as EI from '../../../../database/entities.index';

export interface HawkMethodImplementation {
    parseRequest(request: Hapi.Request, options: ParseRequestOptions): Promise<{ artifacts: Artifacts, credentials: Credentials }>;
    checkMac(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void>;
    checkPayload(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void>;
    checkNonce(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void>;
    checkTimestamp(artifacts: Artifacts, credentials: Credentials, options: ParseRequestOptions): Promise<void>;
}

export interface ParseRequestOptions {
    timestampSkewSec?: number;
    localtimeOffsetMsec?: number;
    host?: string;
    port?: number;
    hostHeaderName?: string;
    keys?: string[];
    payload?: string;
}

export interface Artifacts extends Hapi.AuthArtifacts {
    method: string;
    host: string;
    port: number;
    resource: string;
    ct: string;
    ts: number;
    tsss: number;
    tsn: number;
    nonce: string;
    hash: string;
    ext: string;
    app: string;
    dlg: string;
    mac: string;
    id: string;
}

export interface Credentials extends Hapi.AuthCredentials {
    user: EI.AuthEntity
}
