import { Request as RequestExpress, Response as ResponseExpress, NextFunction as NextFunctionExpress } from 'express';

import * as EI from '../../database/entities.index';

import { HawkArtifactType } from '../types/hawk.type';

export interface Request extends RequestExpress {

}

export interface Response extends ResponseExpress {
    locals: Locals;
}

export interface NextFunction extends NextFunctionExpress {

}

export type Locals = {
    hawk: {
        artifacts?: HawkArtifactType;
        credentials?: EI.AuthEntity;
    };
}
