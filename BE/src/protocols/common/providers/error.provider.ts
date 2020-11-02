import { ErrorImplementation as ErrorDatabaseImplementation } from '../../database/implementations/error.implementation';
import * as ErrorDatabaseJSON from '../../database/assets/error.json';

import { ErrorImplementation as ErrorRestImplementation } from '../../rest/implementations/error.implementation';
import * as ErrorRestJSON from '../../rest/assets/error.json';

import { ErrorImplementation as ErrorSocketImplementation } from '../../socket/implementations/error.implementation';
import * as ErrorSocketJSON from '../../socket/assets/error.json';

export class CustomErrorProvider {

    private static map = new Map<keyof ErrorImplementation, ErrorJSONImplementation>([
        ['Database', ErrorDatabaseJSON],
        ['Rest', ErrorRestJSON],
        ['Socket', ErrorSocketJSON]
    ]);

    public static getError<P extends keyof ErrorImplementation, C extends keyof ErrorImplementation[P], E extends keyof ErrorImplementation[P][C]>(protocol: P, category: C, error: E): CustomError {
        const ErrorJSON = CustomErrorProvider.map.get(protocol);
        const GATEGORY = ErrorJSON.GATEGORIES[category as string];
        const ERROR = GATEGORY.ERRORS[error as string];
        return new CustomError(GATEGORY.CODE, ERROR.CODE, ERROR.DESCRIPTION);
    }

}

export class CustomError {

    constructor(
        public readonly categoryCode,
        public readonly errorCode,
        public readonly description
    ) { }

    public toString(): string {
        return this.categoryCode + '_' + this.errorCode + ' - ' + this.description;
    }

    public compare(error: CustomError): boolean {
        return CustomError.compare(this, error);
    }

    public static compare(error1: CustomError, error2: CustomError): boolean {
        return error1.categoryCode === error2.categoryCode && error1.errorCode === error2.errorCode;
    }

}

interface ErrorImplementation {
    Database: ErrorDatabaseImplementation;
    Rest: ErrorRestImplementation;
    Socket: ErrorSocketImplementation;
}

interface ErrorJSONImplementation {
    GATEGORIES: {
        [NAME: string]: {
            CODE: string;
            ERRORS: {
                [NAME: string]: {
                    CODE: string;
                    DESCRIPTION: string;
                };
            };
        };
    };
}
