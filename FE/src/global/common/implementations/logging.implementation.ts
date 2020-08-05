import { LoggingTypeEnum } from '../enum/logging-type.enum';

export interface LoggingServiceImplementation {
    LOG(log: keyof LoggingTypeEnum, message: { class: string; function: string; text?: string; }, ...data: any[]): void;
}
