export interface ErrorImplementation {
    GENERIC: ErrorCategoryGenericImplementation;
}

export interface ErrorCategoryGenericImplementation {
    UNRECOGNIZED: { code: string; description: string; };
    UNCAUGHT: { code: string; description: string; };
}
