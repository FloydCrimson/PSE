import { LoggingTypeMap } from './logging-type.enum';

export interface LoggingLevelEnum {
    /** Log disabled. */
    OFF: number;
    /** Log TRACE, DEBUG, INFO, WARN, ERROR, FATAL. */
    ALL: number;
    /** Log DEBUG, INFO, WARN, ERROR, FATAL. */
    DEV: number;
    /** Log WARN, ERROR, FATAL. */
    MAIN: number;
}

export const LoggingLevelMap: LoggingLevelEnum = {
    OFF: 0,
    ALL: LoggingTypeMap.TRACE | LoggingTypeMap.DEBUG | LoggingTypeMap.INFO | LoggingTypeMap.WARN | LoggingTypeMap.ERROR | LoggingTypeMap.FATAL,
    DEV: LoggingTypeMap.DEBUG | LoggingTypeMap.INFO | LoggingTypeMap.WARN | LoggingTypeMap.ERROR | LoggingTypeMap.FATAL,
    MAIN: LoggingTypeMap.WARN | LoggingTypeMap.ERROR | LoggingTypeMap.FATAL
};
