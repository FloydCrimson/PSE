export interface DomainImplementation {
    protocols: {
        [name: string]: {
            protocol: 'http' | 'https';
            url: string;
            port: number;
        };
    };
}
