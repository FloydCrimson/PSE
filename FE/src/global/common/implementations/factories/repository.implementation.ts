import { Observable } from 'rxjs';

import { EndpointImplementation } from '../endpoint.implementation';
import { RequestImplementation } from '../request.implementation';
import { ResponseImplementation } from '../response.implementation';

export interface RepositoryImplementation {
    call<B, P, O>(endpoint: EndpointImplementation<B, P, O>, request: RequestImplementation<B, P>): Observable<ResponseImplementation<O>>;
}
