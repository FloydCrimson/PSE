import { MergerProvider } from 'pse-global-providers';

import { CountryImplementation } from 'countries/common/implementations/countries.implementation';
import * as extra from '../country-extra.json';

const countryExtra: CountryImplementation = (<any>extra as { default: any }).default;
const countryOriginal: CountryImplementation = {
    country: 'it',
    languages: ['it', 'en'],
    defaultLanguage: 'it'
};

export const CountryConfig: CountryImplementation = MergerProvider.merger(countryOriginal, countryExtra);
