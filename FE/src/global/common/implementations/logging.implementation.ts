export interface LoggingServiceImplementation {
    LOG(log: 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL', message: { class: string; function: string; text?: string; }, ...data: any[]): void;
}
