export class FactoryExtension<F>{

    private factories: Map<keyof F, F[keyof F]>;

    constructor() {
        this.factories = new Map<keyof F, F[keyof F]>();
    }

    public set<K extends keyof F>(type: K, service: F[K]): void {
        this.factories.set(type, service);
    }

    public get<K extends keyof F>(type: K): F[K] {
        return this.factories.get(type) as F[K];
    }

}