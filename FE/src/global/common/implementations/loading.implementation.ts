import { LoadingOptions } from '@ionic/core';

export interface LoadingImplementation {
    id: string;
    options?: Omit<LoadingOptions, 'id'>
}
