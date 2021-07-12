import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { DispatcherService } from './dispatcher.service';

import * as PI from '../plugins.index';

export class PluginService extends FactoryExtension<PluginServiceImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
        this.initialize();
    }

    private initialize(): void {
        for (const plugin in PI) {
            super.set(plugin as keyof PluginServiceImplementation, PI[plugin]);
        }
    }

}

export type PluginServiceImplementation = { [P in keyof typeof PI]: typeof PI[P]; };
