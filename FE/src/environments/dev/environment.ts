import { MergerProvider } from 'pse-global-providers';

import { EnvironmentImplementation } from 'environments/common/implementations/environment.implementation';
import * as extra from '../environment-extra.json';

const environmentExtra: EnvironmentImplementation = (<any>extra as { default: any }).default;
const environmentOriginal: EnvironmentImplementation = {
  production: false,
  enableRouterTracing: true,
  loggingLevel: 'DEV'
};

export const EnvironmentConfig: EnvironmentImplementation = MergerProvider.merger(environmentOriginal, environmentExtra);
