import { DomainImplementation } from 'domains/common/implementations/domains.implementation';
import { MergerProvider } from 'global/providers/merger.provider';
import * as extra from '../domain-extra.json';

const domainExtra: DomainImplementation = (<any>extra as { default: any }).default;
const domainOriginal: DomainImplementation = {
    protocols: {
        rest: {
            protocol: 'http',
            url: 'localhost',
            port: 7080
        },
        socket: {
            protocol: 'http',
            url: 'localhost',
            port: 6080
        }
    }
};

export const domain: DomainImplementation = MergerProvider.merger(domainOriginal, domainExtra);
