import * as RestFT from 'global/factories/rest.factory.type';

export const BackendEchoEndpoint: RestFT.RestFactoryTypeBackendEcho = {
    // /echo/echo
    EchoGET: {
        method: 'GET',
        path: '/echo/echo'
    },
    EchoPOST: {
        method: 'POST',
        path: '/echo/echo'
    },
    // /echo/echo-auth-full
    EchoAuthFullGET: {
        method: 'GET',
        path: '/echo/echo-auth-full',
        options: { auth: 'full' }
    },
    EchoAuthFullPOST: {
        method: 'POST',
        path: '/echo/echo-auth-full',
        options: { auth: 'full' }
    },
    // /echo/echo-auth-full-crypted
    EchoAuthFullCryptedGET: {
        method: 'GET',
        path: '/echo/echo-auth-full-crypted',
        options: { auth: 'full', crypted: true }
    },
    EchoAuthFullCryptedPOST: {
        method: 'POST',
        path: '/echo/echo-auth-full-crypted',
        options: { auth: 'full', crypted: true }
    },
    // /echo/echo-auth-partial
    EchoAuthPartialGET: {
        method: 'GET',
        path: '/echo/echo-auth-partial',
        options: { auth: 'partial' }
    },
    EchoAuthPartialPOST: {
        method: 'POST',
        path: '/echo/echo-auth-partial',
        options: { auth: 'partial' }
    },
    // /echo/echo-auth-partial-crypted
    EchoAuthPartialCryptedGET: {
        method: 'GET',
        path: '/echo/echo-auth-partial-crypted',
        options: { auth: 'partial', crypted: true }
    },
    EchoAuthPartialCryptedPOST: {
        method: 'POST',
        path: '/echo/echo-auth-partial-crypted',
        options: { auth: 'partial', crypted: true }
    }
};
