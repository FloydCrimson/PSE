import * as SocketFT from 'global/factories/socket.factory.type';

import { BackendEchoEndpoint } from './backend/echo.endpoint';

export const SocketFactoryEndpoint: SocketFT.SocketFactoryTypes = {
    Backend: {
        Echo: BackendEchoEndpoint
    }
}
