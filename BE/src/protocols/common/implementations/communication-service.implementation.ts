import { CommunicationService as CommunicationServiceDatabase } from '../../database/services/communication.service';
import { CommunicationService as CommunicationServiceRest } from '../../rest/services/communication.service';
import { CommunicationService as CommunicationServiceSocket } from '../../socket/services/communication.service';

export interface CommunicationServiceImplementation {
    database: CommunicationServiceDatabase;
    rest: CommunicationServiceRest;
    socket: CommunicationServiceSocket;
}
