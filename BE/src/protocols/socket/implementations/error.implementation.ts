export interface ErrorImplementation {
    GENERIC: ErrorCategoryGenericImplementation;
}

export interface ErrorCategoryGenericImplementation {
    UNCAUGHT: { code: string; description: string; };
}
