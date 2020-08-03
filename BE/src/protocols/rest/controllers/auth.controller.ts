import { Request, Response } from 'express';

import { ControllerExtension } from '../extensions/controller.extension';
import { AuthRoute } from '../routes/auth.route';
import { DispatcherService } from '../services/dispatcher.service';
import { RandomProvider } from '../../../global/providers/random.provider';

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
            const email = await this.dispatcherService.get('CommunicationClientService').send({ receiver: 'database', name: 'AuthEntityFindOne', value: { type: 'email', value: body.email } });
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
            const nickname = await this.dispatcherService.get('CommunicationClientService').send({ receiver: 'database', name: 'AuthEntityFindOne', value: { type: 'nickname', value: body.nickname } });
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
            const email = await this.dispatcherService.get('CommunicationClientService').send({ receiver: 'database', name: 'AuthEntityFindOne', value: { type: 'email', value: body.email } });
            const nickname = await this.dispatcherService.get('CommunicationClientService').send({ receiver: 'database', name: 'AuthEntityFindOne', value: { type: 'nickname', value: body.nickname } });
            output = { email: email === undefined, nickname: nickname === undefined, success: false };
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

}
