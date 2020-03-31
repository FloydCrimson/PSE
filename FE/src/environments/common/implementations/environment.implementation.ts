import { LoggingLevelEnum } from 'global/common/enum/logging-level.enum';

export interface EnvironmentImplementation {
    production: boolean;
    enableRouterTracing: boolean;
    loggingLevel: LoggingLevelEnum;
}
