import * as CryptoJS from 'crypto-js';

export class NonceProvider {

    public static generate(key: string, timestamp: number | string): string {
        const hash = CryptoJS.MD5(timestamp.toString(), key);
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Utf8.parse(hash));
    }

    public static check(key: string, nonce: string, timestamp: number | string): Promise<boolean> {
        if (NonceProvider.generate(key, timestamp) !== nonce) {
            throw 'Invalid nonce';
        }
        return Promise.resolve(true);
    }

}
