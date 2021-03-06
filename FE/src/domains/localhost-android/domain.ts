import { MergerProvider } from 'pse-global-providers';

import { DomainImplementation } from 'domains/common/implementations/domains.implementation';
import * as extra from '../domain-extra.json';

const domainExtra: DomainImplementation = (<any>extra as { default: any }).default;
const domainOriginal: DomainImplementation = {
    protocols: {
        rest: {
            secure: false,
            url: '10.0.2.2',
            port: 7080
        },
        socket: {
            secure: false,
            url: '10.0.2.2',
            port: 6080
        }
    }
};

export const DomainConfig: DomainImplementation = MergerProvider.merger(domainOriginal, domainExtra);
