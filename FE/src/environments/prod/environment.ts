import { EnvironmentImplementation } from 'environments/common/implementations/environment.implementation';
import * as extra from '../common/extra/environment.json';

const environmentExtra: EnvironmentImplementation = {
  ...(<any>extra as { default: any }).default
};
const environmentOriginal: EnvironmentImplementation = {
  production: true,
  enableRouterTracing: false
};

export const environment: EnvironmentImplementation = { ...environmentOriginal, ...environmentExtra };
