import { LoggingLevelEnum } from './logging-level.enum';

export enum LoggingTypeEnum {
    /** Designates finer-grained informational events than the DEBUG. */
    TRACE = LoggingLevelEnum.ALL,
    /** Designates fine-grained informational events that are most useful to debug an application. */
    DEBUG = LoggingLevelEnum.DEV,
    /** Designates informational messages that highlight the progress of the application at coarse-grained level. */
    INFO = LoggingLevelEnum.DEV,
    /** Designates potentially harmful situations. */
    WARN = LoggingLevelEnum.MAIN,
    /** Designates error events that might still allow the application to continue running. */
    ERROR = LoggingLevelEnum.MAIN,
    /** Designates very severe error events that will presumably lead the application to abort. */
    FATAL = LoggingLevelEnum.MAIN
}
