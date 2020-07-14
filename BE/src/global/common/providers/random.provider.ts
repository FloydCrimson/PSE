import * as CryptoJS from 'crypto-js';

export class RandomProvider {

    public static base64(bytes: number): string {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(bytes))).replace(/=+$/, '');
    }

    public static utf8(bytes: number): string {
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(bytes)));
    }

}
