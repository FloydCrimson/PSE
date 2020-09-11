import { CommunicationServiceImplementation as CommunicationServiceDatabaseImplementation } from '../../database/services/communication.service';
import { CommunicationServiceImplementation as CommunicationServiceRestImplementation } from '../../rest/services/communication.service';
import { CommunicationServiceImplementation as CommunicationServiceSocketImplementation } from '../../socket/services/communication.service';

export interface CommunicationImplementationType {
    database: CommunicationServiceDatabaseImplementation;
    rest: CommunicationServiceRestImplementation;
    socket: CommunicationServiceSocketImplementation;
}
