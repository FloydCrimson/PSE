export interface DomainImplementation {
    protocols: {
        [name: string]: {
            secure: boolean;
            url: string;
            port: number;
        };
    };
}
