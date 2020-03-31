export enum LoggingLevelEnum {
    /** Log TRACE, DEBUG, INFO, WARN, ERROR, FATAL. */
    ALL = 3,
    /** Log DEBUG, INFO, WARN, ERROR, FATAL. */
    DEV = 2,
    /** Log WARN, ERROR, FATAL. */
    MAIN = 1,
    /** Log disabled. */
    OFF = 0
}
