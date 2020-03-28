import { Request, Response } from 'express';

import { ControllerExtension } from '../common/extensions/controller.extension';
import { RoleType } from '../common/types/role.type';
import { AuthRouteImplementation, AuthRoute } from '../routes/auth.route';
import { DispatcherService } from '../services/dispatcher.service';
import { CrypterProvider } from '../providers/crypter.provider';
import { CoderProvider } from '../providers/coder.provider';
import { RandomProvider } from '../providers/random.provider';
import * as EI from '../entities.index';

export class AuthController extends ControllerExtension<AuthRouteImplementation> {

    constructor(
        private readonly dispatcherService: DispatcherService
    ) {
        super();
    }

    async emailAvailable(request: Request, response: Response): Promise<{ email: boolean; }> {
        let { body, params, output } = super.getArguments('EmailAvailablePOST', AuthRoute.EmailAvailablePOST, request);
        super.checkArgumentValidity(body, { email: 'string' });
        try {
            const email = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ email: body.email });
            output = { email: email === undefined };
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        super.checkArgumentValidity(output, { email: 'boolean' });
        return output;
    }

    async nicknameAvailable(request: Request, response: Response): Promise<{ nickname: boolean; }> {
        let { body, params, output } = super.getArguments('NicknameAvailablePOST', AuthRoute.NicknameAvailablePOST, request);
        super.checkArgumentValidity(body, { nickname: 'string' });
        try {
            const nickname = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ nickname: body.nickname });
            output = { nickname: nickname === undefined };
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
        super.checkArgumentValidity(output, { nickname: 'boolean' });
        return output;
    }

    async signin(request: Request, response: Response): Promise<{ email: boolean; nickname: boolean; success: boolean; }> {
        let { body, params, output } = super.getArguments('SignInPOST', AuthRoute.SignInPOST, request);
        super.checkArgumentValidity(body, { email: 'string', nickname: 'string', password: 'string' });
        try {
            const email = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ email: body.email });
            const nickname = await this.dispatcherService.get('RepositoryService').get('UserEntity').findOne({ nickname: body.nickname });
            output = { email: email === undefined, nickname: nickname === undefined, success: false };
            if (output.email && output.nickname) {
                let id;
                do {
                    id = RandomProvider.base64(7);
                } while (await this.dispatcherService.get('RepositoryService').get('HawkEntity').findOne({ id }));
                const key = RandomProvider.base64(15);
                const credentials = CrypterProvider.encrypt(id, body.password) + ':' + CrypterProvider.encrypt(key, body.password);
                const link = 'pse://pse.com/echo?params=' + CoderProvider.encode(JSON.stringify({ credentials }));
                const result = await this.dispatcherService.get('EmailService').send({
                    from: 'PSE',
                    to: body.email,
                    subject: 'Credentials',
                    text: `Hello ${body.nickname}!`,
                    html: `
                <b>Hello ${body.nickname}!</b>
                <br>
                Click <a href="${link}">here</a> to save your credentials!
                `
                });
                output.success = result.success;
                if (output.success) {
                    const userEntity = new EI.UserEntity();
                    userEntity.email = body.email;
                    userEntity.nickname = body.nickname;
                    userEntity.role = RoleType.USER;
                    const hawkEntity = new EI.HawkEntity();
                    hawkEntity.id = id;
                    hawkEntity.key = key;
                    hawkEntity.algorithm = 'sha256';
                    hawkEntity.credentials = credentials;
                    hawkEntity.authenticated = false;
                    hawkEntity.attempts = 0;
                    hawkEntity.user = userEntity;
                    await this.dispatcherService.get('RepositoryService').get('HawkEntity').save(hawkEntity);
                }
            }
        } catch (error) {
            throw { message: 'An unmanaged error occurred.' };
        }
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
