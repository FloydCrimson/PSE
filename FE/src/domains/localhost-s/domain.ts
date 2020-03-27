import { DomainImplementation } from 'domains/common/implementations/domains.implementation';
import * as extra from '../domain-extra.json';

const domainExtra: DomainImplementation = {
    ...(<any>extra as { default: any }).default
};
const domainOriginal: DomainImplementation = {
    protocol: 'https',
    url: 'localhost',
    port: 3000
};

export const domain: DomainImplementation = { ...domainOriginal, ...domainExtra };
