import { DomainImplementation } from 'domains/common/implementations/domains.implementation';
import { MergerProvider } from 'global/providers/merger.provider';
import * as extra from '../domain-extra.json';

const domainExtra: DomainImplementation = {
    ...(<any>extra as { default: any }).default
};
const domainOriginal: DomainImplementation = {
    protocol: 'http',
    url: '10.0.2.2',
    port: 3000
};

export const domain: DomainImplementation = MergerProvider.merger(domainOriginal, domainExtra);
