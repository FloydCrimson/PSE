export interface AuthMethodImplementation {
    test(): Promise<boolean>;
}
