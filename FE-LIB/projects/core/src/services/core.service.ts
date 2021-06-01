import { Injectable, Optional } from '@angular/core';

export class PSECoreServiceConfig { }

@Injectable()
export class PSECoreService {

    constructor(
        @Optional() private readonly config?: PSECoreServiceConfig
    ) { }

}
