import { Request, Response } from 'express';

import { ControllerExtension } from '../extensions/controller.extension';
import { RoleType } from '../types/role.type';
import { AuthRoute } from '../routes/auth.route';
import { DispatcherService } from '../services/dispatcher.service';
import { CrypterProvider } from '../../../global/common/providers/crypter.provider';
import { CoderProvider } from '../../../global/common/providers/coder.provider';
import { RandomProvider } from '../../../global/common/providers/random.provider';
import * as EI from '../entities.index';

export class AuthController extends ControllerExtension {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async emailAvailable(request: Request, response: Response): Promise<{ email: boolean; }> {
        let { body, params, output } = super.getArguments(AuthRoute.EmailAvailablePOST, request);
        if (super.checkArgumentValidity(body, { email: 'string' })) throw 'Bad arguments.';
        try {
            const email = await this.dispatcherService.get('RepositoryService').get('AuthEntity').findOne({ email: body.email });
            output = { email: email === undefined };
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        if (super.checkArgumentValidity(output, { email: 'boolean' })) throw 'Bad arguments.';
        return output;
    }

    async nicknameAvailable(request: Request, response: Response): Promise<{ nickname: boolean; }> {
        let { body, params, output } = super.getArguments(AuthRoute.NicknameAvailablePOST, request);
        if (super.checkArgumentValidity(body, { nickname: 'string' })) throw 'Bad arguments.';
        try {
            const nickname = await this.dispatcherService.get('RepositoryService').get('AuthEntity').findOne({ nickname: body.nickname });
            output = { nickname: nickname === undefined };
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        if (super.checkArgumentValidity(output, { nickname: 'boolean' })) throw 'Bad arguments.';
        return output;
    }

    async signin(request: Request, response: Response): Promise<{ email: boolean; nickname: boolean; success: boolean; }> {
        let { body, params, output } = super.getArguments(AuthRoute.SignInPOST, request);
        if (super.checkArgumentValidity(body, { email: 'string', nickname: 'string', password: 'string' })) throw 'Bad arguments.';
        try {
            const email = await this.dispatcherService.get('RepositoryService').get('AuthEntity').findOne({ email: body.email });
            const nickname = await this.dispatcherService.get('RepositoryService').get('AuthEntity').findOne({ nickname: body.nickname });
            output = { email: email === undefined, nickname: nickname === undefined, success: false };
            if (output.email && output.nickname) {
                let id;
                do {
                    id = RandomProvider.base64(7);
                } while (await this.dispatcherService.get('RepositoryService').get('AuthEntity').findOne({ id }));
                const key = RandomProvider.base64(15);
            }
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        if (super.checkArgumentValidity(output, { email: 'boolean', nickname: 'boolean', success: 'boolean' })) throw 'Bad arguments.';
        return output;
    }

    async signout(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(AuthRoute.SignOutPOST, request);
        return output;
    }

    async login(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(AuthRoute.LogInPOST, request);
        return output;
    }

    async logout(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(AuthRoute.LogOutPOST, request);
        return output;
    }

}
