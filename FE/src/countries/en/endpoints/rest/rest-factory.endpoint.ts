import * as RestFT from 'global/factories/rest.factory.type';

import { BackendAuthEndpoint } from './backend/auth.endpoint';
import { BackendEchoEndpoint } from './backend/echo.endpoint';

export const RestFactoryEndpoint: RestFT.RestFactoryTypes = {
    Backend: {
        Auth: BackendAuthEndpoint,
        Echo: BackendEchoEndpoint
    }
}
