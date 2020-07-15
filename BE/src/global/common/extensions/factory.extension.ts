export class FactoryExtension<F>{

    private factories: Map<keyof F, F[keyof F]>;

    constructor() {
        this.factories = new Map<keyof F, F[keyof F]>();
    }

    public set<K extends keyof F>(type: K, service: F[K], replace: boolean = false): boolean {
        if (replace || !this.factories.has(type)) {
            this.factories.set(type, service);
            return true;
        } else {
            console.warn('[FactoryExtension.set] tried to replace "' + type + '". set has been blocked.');
        }
        return false;
    }

    public get<K extends keyof F>(type: K): F[K] {
        return this.factories.get(type) as F[K];
    }

}
