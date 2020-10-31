export interface ErrorImplementation {
    AUTH: ErrorCategoryAuthImplementation;
    GENERIC: ErrorCategoryGenericImplementation;
}

export interface ErrorCategoryAuthImplementation {
    EMAIL_NOT_RECOVERED: { code: string; description: string; };
    EMAIL_NOT_AVAILABLE: { code: string; description: string; };
    NICKNAME_NOT_RECOVERED: { code: string; description: string; };
    NICKNAME_NOT_AVAILABLE: { code: string; description: string; };
    ID_NOT_RECOVERED: { code: string; description: string; };
    AUTH_ENTITY_NOT_SAVED: { code: string; description: string; };
    EMAIL_NOT_SENT: { code: string; description: string; };
}

export interface ErrorCategoryGenericImplementation {
    REQUEST_MALFORMED: { code: string; description: string; };
    RESPONSE_MALFORMED: { code: string; description: string; };
    UNCAUGHT: { code: string; description: string; };
}
