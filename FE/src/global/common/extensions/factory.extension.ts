export abstract class FactoryExtension<F, T> {

    private factories: Map<keyof T, F> = new Map<keyof T, F>();

    public set<K extends keyof T>(type: K, factory: F): boolean {
        if (this.factories.has(type)) {
            return false;
        }
        this.factories.set(type, factory);
        return true;
    }

    public get<K extends keyof T>(type: K): F {
        return this.factories.get(type);
    }

    public remove<K extends keyof T>(type: K): boolean {
        if (this.factories.has(type)) {
            this.factories.delete(type);
            return true;
        }
        return false;
    }

    public clear(): boolean {
        this.factories.clear();
        return false;
    }

}
