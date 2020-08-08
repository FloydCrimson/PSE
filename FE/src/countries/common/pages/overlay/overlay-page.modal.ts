import { ModalImplementation } from 'global/common/implementations/modal.implementation';

export const OverlayPageModal: ModalImplementation<{ text: string; }, { result: boolean; }> = {
    loadChildren: () => import('./overlay-page').then(m => m.OverlayPage)
};
