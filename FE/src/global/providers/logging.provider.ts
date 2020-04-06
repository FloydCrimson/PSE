import { environment } from '@environments/environment';

import { LoggingTypeEnum } from 'global/common/enum/logging-type.enum';

export class LoggingProvider {

    constructor() { }

    public static TRACE(message?: any, ...optionalParams: any[]): void {
        this.log(LoggingTypeEnum.TRACE, message, ...optionalParams);
    }

    public static DEBUG(message?: any, ...optionalParams: any[]): void {
        this.log(LoggingTypeEnum.DEBUG, message, ...optionalParams);
    }

    public static INFO(message?: any, ...optionalParams: any[]): void {
        this.log(LoggingTypeEnum.INFO, message, ...optionalParams);
    }

    public static WARN(message?: any, ...optionalParams: any[]): void {
        this.log(LoggingTypeEnum.WARN, message, ...optionalParams);
    }

    public static ERROR(message?: any, ...optionalParams: any[]): void {
        this.log(LoggingTypeEnum.ERROR, message, ...optionalParams);
    }

    public static FATAL(message?: any, ...optionalParams: any[]): void {
        this.log(LoggingTypeEnum.FATAL, message, ...optionalParams);
    }

    private static log(type: LoggingTypeEnum, message?: any, ...optionalParams: any[]): void {
        if (environment.loggingLevel > 0 && type >= environment.loggingLevel) {
            switch (type) {
                case LoggingTypeEnum.TRACE:
                case LoggingTypeEnum.DEBUG:
                case LoggingTypeEnum.INFO:
                    console.log(`[PSE-${type === LoggingTypeEnum.TRACE ? 'TRACE' : (type === LoggingTypeEnum.DEBUG ? 'DEBUG' : 'INFO')}] ${message}`, ...optionalParams);
                    return;
                case LoggingTypeEnum.WARN:
                    console.warn(`[PSE-WARN] ${message}`, ...optionalParams);
                    return;
                case LoggingTypeEnum.ERROR:
                case LoggingTypeEnum.FATAL:
                    console.error(`[PSE-${type === LoggingTypeEnum.ERROR ? 'ERROR' : 'FATAL'}] ${message}`, ...optionalParams);
                    return;
            }
        }
    }

}
