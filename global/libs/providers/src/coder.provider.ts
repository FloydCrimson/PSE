import * as CryptoJS from 'crypto-js';

export class CoderProvider {

    public static encode(decoded: string): string {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(decoded)).replace(/=+$/, '');
    }

    public static decode(encoded: string): string {
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encoded));
    }

}
