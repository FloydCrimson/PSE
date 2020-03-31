import { EnvironmentImplementation } from 'environments/common/implementations/environment.implementation';
import { LoggingLevelEnum } from 'global/common/enum/logging-level.enum';
import * as extra from '../environment-extra.json';

const environmentExtra: EnvironmentImplementation = {
  ...(<any>extra as { default: any }).default
};
const environmentOriginal: EnvironmentImplementation = {
  production: true,
  enableRouterTracing: false,
  loggingLevel: LoggingLevelEnum.MAIN
};

export const environment: EnvironmentImplementation = { ...environmentOriginal, ...environmentExtra };
