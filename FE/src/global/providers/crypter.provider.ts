import * as CryptoJS from 'crypto-js'; // TODO: Check error => Module not found: Error: Can't resolve 'crypto'

export class CrypterProvider {

    public static encrypt(decrypted: string, key: string): string {
        const encrypted = CryptoJS.AES.encrypt(decrypted, key);
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    }

    public static decrypt(encrypted: string, key: string): string {
        const decrypted = CryptoJS.AES.decrypt(encrypted, key);
        return CryptoJS.enc.Utf8.stringify(decrypted);
    }

    public static hash(message: string): string {
        const hashed = CryptoJS.SHA256(message);
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Utf8.parse(hashed));
    }

}
