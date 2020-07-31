import { DomainImplementation } from 'domains/common/implementations/domains.implementation';
import { MergerProvider } from 'global/providers/merger.provider';
import * as extra from '../domain-extra.json';

const domainExtra: DomainImplementation = (<any>extra as { default: any }).default;
const domainOriginal: DomainImplementation = {
    protocols: {
        rest: {
            protocol: 'https',
            url: '10.0.2.2',
            port: 7443
        },
        socket: {
            protocol: 'https',
            url: '10.0.2.2',
            port: 6443
        }
    }
};

export const domain: DomainImplementation = MergerProvider.merger(domainOriginal, domainExtra);
