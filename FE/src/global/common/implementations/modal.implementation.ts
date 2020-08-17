export interface ModalImplementation<I = any | undefined, O = any | undefined> {
    loadChildren: () => Promise<Function | HTMLElement | string | null>;
}
