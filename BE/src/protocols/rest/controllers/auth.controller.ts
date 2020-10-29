import { Request, Response } from 'express';

import { EmailProvider } from '../../../global/providers/email.provider';
import { RandomProvider } from '../../../global/providers/random.provider';

import { ControllerExtension } from '../extensions/controller.extension';
import { AuthRoute } from '../routes/auth.route';
import { DispatcherService } from '../services/dispatcher.service';

import { RoleType } from '../../database/types/role.type';
import * as EI from '../../database/entities.index';

export class AuthController extends ControllerExtension {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async EmailAvailablePOST(request: Request, response: Response): Promise<{ email: boolean; }> {
        let { body, params, output } = super.getArguments(AuthRoute.EmailAvailablePOST, request);
        if (super.checkArgumentValidity(body, { email: 'string' })) throw 'Bad arguments.';
        try {
            const email = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { email: body.email });
            output = { email: email === undefined };
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        if (super.checkArgumentValidity(output, { email: 'boolean' })) throw 'Bad arguments.';
        return output;
    }

    async NicknameAvailablePOST(request: Request, response: Response): Promise<{ nickname: boolean; }> {
        let { body, params, output } = super.getArguments(AuthRoute.NicknameAvailablePOST, request);
        if (super.checkArgumentValidity(body, { nickname: 'string' })) throw 'Bad arguments.';
        try {
            const nickname = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { nickname: body.nickname });
            output = { nickname: nickname === undefined };
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        if (super.checkArgumentValidity(output, { nickname: 'boolean' })) throw 'Bad arguments.';
        return output;
    }

    async SignInPOST(request: Request, response: Response): Promise<{ email: boolean; nickname: boolean; success: boolean; }> {
        let { body, params, output } = super.getArguments(AuthRoute.SignInPOST, request);
        if (super.checkArgumentValidity(body, { email: 'string', nickname: 'string', password: 'string' })) throw 'Bad arguments.';
        try {
            const email = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { email: body.email });
            const nickname = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { nickname: body.nickname });
            output = { email: email === undefined, nickname: nickname === undefined, success: false };
            if (output.email && output.nickname) {
                const authEntity = new EI.AuthEntity();
                authEntity.id = await this.getAvailableAuthEntityId();
                authEntity.email = body.email;
                authEntity.nickname = body.nickname;
                authEntity.key = RandomProvider.base64(4).toLocaleUpperCase();
                authEntity.algorithm = 'sha256';
                authEntity.role = RoleType.USER;
                authEntity.authenticated = false;
                authEntity.attempts = 0;
                const result = await EmailProvider.send({
                    from: 'PSE',
                    to: authEntity.email,
                    subject: 'SignIn Request',
                    text: `Hello ${authEntity.nickname}!\n\nHere is your Temporary Password:\n\n${authEntity.key}\n\nYou will be asked to change it after your first access.\n\nThanks, PSE`,
                    html: `Hello ${authEntity.nickname}!<br><br>Here is your Temporary Password:<br><br><b>${authEntity.key}</b><br><br>You will be asked to change it after your first access.<br><br>Thanks, PSE`
                });
                if (result.success) {
                    await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntitySave', authEntity);
                    output.success = true;
                }
            }
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        if (super.checkArgumentValidity(output, { email: 'boolean', nickname: 'boolean', success: 'boolean' })) throw 'Bad arguments.';
        return output;
    }

    async SignOutPOST(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(AuthRoute.SignOutPOST, request);
        return output;
    }

    async LogInPOST(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(AuthRoute.LogInPOST, request);
        return output;
    }

    async LogOutPOST(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments(AuthRoute.LogOutPOST, request);
        return output;
    }

    //

    private async getAvailableAuthEntityId(): Promise<string> {
        let id: string;
        let authEntity: EI.AuthEntity;
        do {
            id = RandomProvider.decimal(100000000, 1000000000).toString();
            authEntity = await this.dispatcherService.get('CommunicationClientService').send('database', 'AuthEntityFindOne', { id });
        } while (authEntity !== undefined);
        return id;
    }

}
