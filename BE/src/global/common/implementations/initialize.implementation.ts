import { ProtocolConfigurationsType } from "../types/protocol-options.type";

export interface InitializeImplementation {
    initialize: (configurations: ProtocolConfigurationsType[]) => Promise<boolean>;
}
