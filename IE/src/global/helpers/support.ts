export class Support {

    public static enumToString<T>(enumerator: Object, value: T): string {
        const entries = Object.entries(enumerator).filter(([, v]) => v === value);
        return entries.length === 0 ? value.toString() : entries.pop()[0];
    }

} 
