export enum LoggingTypeEnum {
    /** Designates finer-grained informational events than the DEBUG. */
    TRACE = 1 << 0,
    /** Designates fine-grained informational events that are most useful to debug an application. */
    DEBUG = 1 << 1,
    /** Designates informational messages that highlight the progress of the application at coarse-grained level. */
    INFO = 1 << 2,
    /** Designates potentially harmful situations. */
    WARN = 1 << 3,
    /** Designates error events that might still allow the application to continue running. */
    ERROR = 1 << 4,
    /** Designates very severe error events that will presumably lead the application to abort. */
    FATAL = 1 << 5
}
