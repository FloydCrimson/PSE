import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { LoggingServiceImplementation } from 'global/common/implementations/logging.implementation';
import { EnvironmentService } from 'global/services/environment.service';
import { LoggingTypeEnum, LoggingTypeMap } from 'global/common/enum/logging-type.enum';
import { LoggingLevelMap } from 'global/common/enum/logging-level.enum';

@Injectable({
    providedIn: 'root'
})
export class LoggingService implements LoggingServiceImplementation {

    constructor(
        private readonly environmentService: EnvironmentService
    ) { }

    public LOG(log: keyof LoggingTypeEnum, message: { class: string; function: string; text?: string; }, ...data: any[]): void {
        const type = LoggingTypeMap[log];
        if ((LoggingLevelMap[this.environmentService.getEnvironment().loggingLevel] & type) === type) {
            const date = moment().format();
            const prefix = log;
            this.getConsoleLogger(log)(`[PSE] [${prefix}] [${date}] [${message.class}.${message.function}]`, ...(message.text ? [message.text, ...data] : data));
        }
    }

    //

    private getConsoleLogger(type: keyof LoggingTypeEnum): (...data: any[]) => void {
        switch (type) {
            case 'TRACE':
                return console.trace;
            case 'DEBUG':
                return console.debug;
            case 'INFO':
                return console.info;
            case 'WARN':
                return console.warn;
            case 'ERROR':
                return console.error;
            case 'FATAL':
                return console.error;
        }
    }

}
