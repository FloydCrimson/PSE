import * as CryptoJS from 'crypto-js';

export class RandomProvider {

    public static decimal(min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
        return Math.floor(min + (max - min) * Math.random());
    }

    public static base64(bytes: number): string {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(bytes))).replace(/=+$/, '');
    }

    public static utf8(bytes: number): string {
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(bytes)));
    }

}
