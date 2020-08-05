import { Observable } from 'rxjs';

import { EndpointRestImplementation } from '../endpoint-rest.implementation';
import { RequestRestImplementation } from '../request-rest.implementation';
import { ResponseRestImplementation } from '../response-rest.implementation';

export interface RestFactoryImplementation {
    call<B, P, O>(endpoint: EndpointRestImplementation<B, P, O>, request: RequestRestImplementation<B, P>): Observable<ResponseRestImplementation<O>>;
}
