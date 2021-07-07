import { CrypterProvider } from 'pse-global-providers';

export class CrypterValidateProvider {

    public static encryptValidate(value: Object, key: string): Object {
        try {
            if (Object.keys(value).length === 0) {
                return value;
            }
            return { plec: CrypterProvider.encrypt(JSON.stringify(value), key) };
        } catch (error) {
            throw 'Invalid decrypted value received.';
        }
    }

    public static decryptValidate(value: Object, key: string): Object {
        try {
            if (Object.keys(value).length === 0) {
                return value;
            }
            if (Object.keys(value).length === 1 && 'plec' in value && typeof value['plec'] === 'string') {
                return JSON.parse(CrypterProvider.decrypt(value['plec'], key));
            }
            throw 'Invalid encrypted value received.';
        } catch (error) {
            throw 'Invalid encrypted value received.';
        }
    }

}
