import { LoggingTypeEnum } from './logging-type.enum';

export enum LoggingLevelEnum {
    /** Log disabled. */
    OFF = 'OFF',
    /** Log TRACE, DEBUG, INFO, WARN, ERROR, FATAL. */
    ALL = 'ALL',
    /** Log DEBUG, INFO, WARN, ERROR, FATAL. */
    DEV = 'DEV',
    /** Log WARN, ERROR, FATAL. */
    MAIN = 'MAIN'
}

export const LoggingLevelMap = {
    [LoggingLevelEnum.OFF]: 0,
    [LoggingLevelEnum.ALL]: LoggingTypeEnum.TRACE | LoggingTypeEnum.DEBUG | LoggingTypeEnum.INFO | LoggingTypeEnum.WARN | LoggingTypeEnum.ERROR | LoggingTypeEnum.FATAL,
    [LoggingLevelEnum.DEV]: LoggingTypeEnum.DEBUG | LoggingTypeEnum.INFO | LoggingTypeEnum.WARN | LoggingTypeEnum.ERROR | LoggingTypeEnum.FATAL,
    [LoggingLevelEnum.MAIN]: LoggingTypeEnum.WARN | LoggingTypeEnum.ERROR | LoggingTypeEnum.FATAL
};
