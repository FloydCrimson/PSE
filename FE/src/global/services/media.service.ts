import { Injectable } from '@angular/core';
import { Capacitor, Plugins, FilesystemDirectory } from '@capacitor/core';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

declare const ffmpeg;

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    private stack = new Array<[string, { resolvers: ((value?: { success: boolean; url?: string; }) => void)[], rejecters: ((reason?: any) => void)[] }]>();

    constructor(
        private readonly fileTransfer: FileTransfer
    ) { }

    public download(urlRemote: string): Promise<{ success: boolean; url?: string; }> {
        return new Promise<{ success: boolean; url?: string; }>((resolve, reject) => {
            const index = this.stack.findIndex((e) => e[0] === urlRemote);
            if (index >= 0) {
                this.stack[index][1].resolvers.push(resolve);
                this.stack[index][1].rejecters.push(reject);
            } else {
                this.stack.push([urlRemote, { resolvers: [resolve], rejecters: [reject] }]);
                if (this.stack.length === 1) {
                    this.next();
                }
            }
        });
    }

    public cached(urlRemote: string): Promise<boolean> {
        return Plugins.Filesystem.stat({ directory: FilesystemDirectory.Cache, path: new URL(urlRemote).pathname.replace(/^\/+/, '') }).then(_ => true, _ => false).catch(_ => false);
    }

    public convert(urlRemote: string, ext: string): Promise<{ success: boolean; url?: string; }> {
        return new Promise<{ success: boolean; url?: string; }>(async (resolve, reject) => {
            const urlLocal = await this.url(urlRemote);
            Plugins.Filesystem.readFile({ directory: FilesystemDirectory.Cache, path: new URL(urlRemote).pathname.replace(/^\/+/, '') }).then((result) => {
                const dataA = MediaService.Base64ToUint8Array(result.data);
                const conversion: { MEMFS: { name: string; data: Uint8Array; }[] } = ffmpeg({
                    MEMFS: [{ name: 'input.webm', data: dataA }],
                    arguments: ['-i', 'input.webm', 'output' + ext],
                    print: (...args) => console.log(args),
                    printErr: (...args) => console.error(args)
                });
                if (conversion && conversion.MEMFS && conversion.MEMFS.length === 1) {
                    const dataB = MediaService.Uint8ArrayToBase64(conversion.MEMFS[0].data);
                    Plugins.Filesystem.writeFile({ directory: FilesystemDirectory.Cache, path: new URL(urlRemote).pathname.replace(/^\/+/, '') + '.mp4', data: dataB, recursive: true }).then((result) => {
                        resolve({ success: true, url: Capacitor.convertFileSrc(result.uri) });
                    }, (error) => resolve({ success: false })).catch((error) => resolve({ success: false }));
                } else {
                    resolve({ success: false });
                }
            }, (error) => resolve({ success: false })).catch((error) => resolve({ success: false }));
        });
    }

    private transfer(urlRemote: string, urlLocal: string): Promise<boolean> {
        return this.fileTransfer.create().download(urlRemote, urlLocal, true).then(_ => true, _ => false).catch(_ => false);
    }

    private url(urlRemote: string): Promise<string> {
        return Plugins.Filesystem.getUri({ directory: FilesystemDirectory.Cache, path: new URL(urlRemote).pathname.replace(/^\/+/, '') }).then((result) => result.uri, _ => null).catch(_ => null);
    }

    //

    private async next(): Promise<void> {
        if (this.stack.length > 0) {
            const [urlRemote, { resolvers, rejecters }] = this.stack[0];
            const urlLocal = await this.url(urlRemote);
            if (urlLocal) {
                const cached = await this.cached(urlRemote);
                if (cached) {
                    console.log('Media cached.', urlRemote, urlLocal);
                    resolvers.forEach((resolve) => resolve({ success: true, url: Capacitor.convertFileSrc(urlLocal) }));
                } else {
                    console.log('Media not cached. Downloading...', urlRemote, urlLocal);
                    const transferred = await this.transfer(urlRemote, urlLocal);
                    if (transferred) {
                        console.log('Media downloaded.', urlRemote, urlLocal);
                        resolvers.forEach((resolve) => resolve({ success: true, url: Capacitor.convertFileSrc(urlLocal) }));
                    } else {
                        console.warn('Unable to download.', urlRemote, urlLocal);
                        resolvers.forEach((resolve) => resolve({ success: false }));
                    }
                }
            } else {
                console.warn('Unable to resolve local url.', urlRemote, urlLocal);
                resolvers.forEach((resolve) => resolve({ success: false }));
            }
            this.stack.shift();
            this.next();
        }
    }

    // SUPPORT

    private static Base64ToUint8Array(base64: string): Uint8Array {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer as Uint8Array;
    }

    private static Uint8ArrayToBase64(array: Uint8Array): string {
        const CHUNK = 0x8000;
        var c = [];
        for (var i = 0; i < array.length; i += CHUNK) {
            c.push(String.fromCharCode.apply(null, array.subarray(i, i + CHUNK)));
        }
        return c.join('');
    }

}
