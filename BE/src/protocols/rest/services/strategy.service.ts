import { FactoryExtension } from '../../../global/common/extensions/factory.extension';
import { DispatcherService } from './dispatcher.service';

import * as SI from '../strategies.index';

export class StrategyService extends FactoryExtension<StrategyServiceImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
        this.initialize();
    }

    private initialize(): void {
        for (const strategy in SI) {
            super.set(strategy as keyof StrategyServiceImplementation, SI[strategy]);
        }
    }

}

export type StrategyServiceImplementation = { [S in keyof typeof SI]: typeof SI[S]; };
