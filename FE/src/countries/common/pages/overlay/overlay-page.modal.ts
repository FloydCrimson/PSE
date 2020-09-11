import { ModalImplementation } from 'global/common/implementations/modal.implementation';

import { OverlayPage } from './overlay-page';

export const OverlayPageModal: ModalImplementation<{ text: string; }, { result: boolean; }> = {
    component: OverlayPage
};
