export interface ModalImplementation<I = undefined, O = undefined> {
    loadChildren: () => Promise<Function | HTMLElement | string | null>;
}
