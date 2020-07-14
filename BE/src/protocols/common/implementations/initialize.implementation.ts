export interface InitializeImplementation {
    initialize: (port: number) => Promise<boolean>;
}
