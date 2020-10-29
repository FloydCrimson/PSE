import { ModalImplementation } from 'global/common/implementations/modal.implementation';

export const OverlayComponentModal: ModalImplementation<{ text: string; }, { result: boolean; }> = {
    component: () => import('./overlay-component').then(c => c.OverlayComponent)
};
