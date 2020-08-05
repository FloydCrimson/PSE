export interface LoggingTypeEnum {
    /** Designates finer-grained informational events than the DEBUG. */
    TRACE: number,
    /** Designates fine-grained informational events that are most useful to debug an application. */
    DEBUG: number,
    /** Designates informational messages that highlight the progress of the application at coarse-grained level. */
    INFO: number,
    /** Designates potentially harmful situations. */
    WARN: number,
    /** Designates error events that might still allow the application to continue running. */
    ERROR: number,
    /** Designates very severe error events that will presumably lead the application to abort. */
    FATAL: number
}

export const LoggingTypeMap: LoggingTypeEnum = {
    TRACE: 1 << 0,
    DEBUG: 1 << 1,
    INFO: 1 << 2,
    WARN: 1 << 3,
    ERROR: 1 << 4,
    FATAL: 1 << 5
}
