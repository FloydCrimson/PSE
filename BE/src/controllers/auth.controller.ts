import { Request, Response } from 'express';

import { ControllerExtension } from '../common/extensions/controller.extension';
import { AuthRouteImplementation, AuthRoute } from '../routes/auth.route';
import { DispatcherService } from '../services/dispatcher.service';

export class AuthController extends ControllerExtension<AuthRouteImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async emailAvailable(request: Request, response: Response): Promise<{ email: boolean; }> {
        let { body, params, output } = super.getArguments('EmailAvailablePOST', AuthRoute.EmailAvailablePOST, request);
        super.checkArgumentValidity(body, { email: 'string' });
        //
        const email = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ email: body.email });
        output = { email: email === undefined };
        //
        super.checkArgumentValidity(output, { email: 'boolean' });
        return output;
    }

    async nicknameAvailable(request: Request, response: Response): Promise<{ nickname: boolean; }> {
        let { body, params, output } = super.getArguments('NicknameAvailablePOST', AuthRoute.NicknameAvailablePOST, request);
        super.checkArgumentValidity(body, { nickname: 'string' });
        //
        const nickname = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ nickname: body.nickname });
        output = { nickname: nickname === undefined };
        //
        super.checkArgumentValidity(output, { nickname: 'boolean' });
        return output;
    }

    async signin(request: Request, response: Response): Promise<{ email: boolean; nickname: boolean; success: boolean; }> {
        let { body, params, output } = super.getArguments('SignInPOST', AuthRoute.SignInPOST, request);
        super.checkArgumentValidity(body, { email: 'string', nickname: 'string', password: 'string' });
        //
        const email = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ email: body.email });
        const nickname = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ nickname: body.nickname });
        output = { email: email === undefined, nickname: nickname === undefined, success: true }; // TODO: send email
        //
        super.checkArgumentValidity(output, { email: 'boolean', nickname: 'boolean', success: 'boolean' });
        return output;
    }

    async signout(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments('SignOutPOST', AuthRoute.SignOutPOST, request);
        return output;
    }

    async login(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments('LogInPOST', AuthRoute.LogInPOST, request);
        return output;
    }

    async logout(request: Request, response: Response): Promise<any> {
        let { body, params, output } = super.getArguments('LogOutPOST', AuthRoute.LogOutPOST, request);
        return output;
    }

}
