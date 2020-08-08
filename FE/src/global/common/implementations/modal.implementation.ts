import { LoadChildren } from '@angular/router';

export interface ModalImplementation<I, O> {
    loadChildren: () => Promise<Function | HTMLElement | string | null>;
}
