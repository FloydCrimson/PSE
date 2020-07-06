import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { LoggingServiceImplementation } from 'global/common/implementations/logging.implementation';
import { EnvironmentService } from 'global/services/environment.service';
import { LoggingTypeEnum } from 'global/common/enum/logging-type.enum';
import { LoggingLevelMap } from 'global/common/enum/logging-level.enum';

@Injectable({
    providedIn: 'root'
})
export class LoggingService implements LoggingServiceImplementation {

    constructor(
        private readonly environmentService: EnvironmentService
    ) { }

    public LOG(log: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL', message: { class: string; function: string; text?: string; }, ...data: any[]): void {
        const type = LoggingTypeEnum[log];
        if ((LoggingLevelMap[this.environmentService.getEnvironment().loggingLevel] & type) === type) {
            const date = moment().format();
            const prefix = log;
            this.getConsoleFromLoggingTypeEnum(type)(`[PSE] [${prefix}] [${date}]`, message, ...data);
        }
    }

    //

    private getConsoleFromLoggingTypeEnum(type: LoggingTypeEnum): (...data: any[]) => void {
        switch (type) {
            case LoggingTypeEnum.TRACE:
                return console.trace;
            case LoggingTypeEnum.DEBUG:
                return console.debug;
            case LoggingTypeEnum.INFO:
                return console.info;
            case LoggingTypeEnum.WARN:
                return console.warn;
            case LoggingTypeEnum.ERROR:
                return console.error;
            case LoggingTypeEnum.FATAL:
                return console.error;
        }
    }

}
