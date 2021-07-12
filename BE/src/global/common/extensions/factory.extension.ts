export class FactoryExtension<F>{

    private readonly factories = new Map<keyof F, F[keyof F]>();

    constructor() { }

    public has<K extends keyof F>(type: K): boolean {
        return this.factories.has(type);
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

    public delete<K extends keyof F>(type: K): boolean {
        return this.factories.delete(type);
    }

    public clear(): void {
        this.factories.clear();
    }

    public keys(): (keyof F)[] {
        return Array.from(this.factories.keys());
    }

    public values(): F[keyof F][] {
        return Array.from(this.factories.values());
    }

    public entries(): [keyof F, F[keyof F]][] {
        return Array.from(this.factories.entries());
    }

}
