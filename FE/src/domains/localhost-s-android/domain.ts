import { MergerProvider } from 'pse-global-providers';

import { DomainImplementation } from 'domains/common/implementations/domains.implementation';
import * as extra from '../domain-extra.json';

const domainExtra: DomainImplementation = (<any>extra as { default: any }).default;
const domainOriginal: DomainImplementation = {
    protocols: {
        rest: {
            secure: true,
            url: '10.0.2.2',
            port: 7443
        },
        socket: {
            secure: true,
            url: '10.0.2.2',
            port: 6443
        }
    }
};

export const domain: DomainImplementation = MergerProvider.merger(domainOriginal, domainExtra);
