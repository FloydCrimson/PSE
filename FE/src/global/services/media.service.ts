import { Injectable } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    private stack: Map<string, [((value?: { success: boolean; url?: string; error?: any; }) => void)[], ((reason?: any) => void)[]]>;

    constructor(
        private readonly fileTransfer: FileTransfer,
        private readonly file: File
    ) {
        this.stack = new Map<string, [((value?: { success: boolean; url?: string; error?: any; }) => void)[], ((reason?: any) => void)[]]>();
    }

    public download(urlRemote: string): Promise<{ success: boolean; url?: string; error?: any; }> {
        return new Promise<{ success: boolean; url?: string; error?: any; }>((resolve, reject) => {
            if (this.stack.has(urlRemote)) {
                const [resolvers, rejecters] = this.stack.get(urlRemote);
                resolvers.push(resolve);
                rejecters.push(reject);
            } else {
                this.stack.set(urlRemote, [[resolve], [reject]]);
                if (this.stack.size === 1) {
                    this.next();
                }
            }
        });
    }

    //

    private next(): void {
        if (this.stack.size > 0) {
            const urlRemote = this.stack.keys().next().value;
            const urlLocal = this.file.applicationStorageDirectory + new URL(urlRemote).pathname.replace(/^\/+/, '');
            const [resolvers, rejecters] = this.stack.get(urlRemote);
            this.file.checkFile(this.file.applicationStorageDirectory, new URL(urlRemote).pathname.replace(/^\/+/, '')).then(_ => {
                this.nextResolve(resolvers, urlRemote, urlLocal);
                console.log('Media cached.', urlRemote, urlLocal);
            }, _ => {
                console.log('Media not cached. Downloading...', urlRemote, urlLocal);
                this.fileTransfer.create().download(urlRemote, urlLocal, true).then(_ => {
                    this.nextResolve(resolvers, urlRemote, urlLocal);
                    console.log('Media downloaded.', urlRemote, urlLocal);
                }, (error) => {
                    this.nextReject(resolvers, urlRemote, error);
                    console.warn('Unable to download.', urlRemote, urlLocal, error);
                }).catch((error) => {
                    this.nextReject(resolvers, urlRemote, error);
                    console.warn('Unable to download.', urlRemote, urlLocal, error);
                });
            }).catch((error) => {
                this.nextReject(resolvers, urlRemote, error);
                console.warn('Unable to check cache existance.', urlRemote, urlLocal, error);
            });
        }
    }

    private nextResolve(resolvers: ((value?: { success: boolean; url?: string; error?: any; }) => void)[], urlRemote: string, urlLocal: string): void {
        resolvers.forEach((resolve) => resolve({ success: true, url: Capacitor.convertFileSrc(urlLocal) }));
        this.stack.delete(urlRemote);
        this.next();
    }

    private nextReject(resolvers: ((value?: { success: boolean; url?: string; error?: any; }) => void)[], urlRemote: string, error: any): void {
        resolvers.forEach((resolve) => resolve({ success: false, error }));
        this.stack.delete(urlRemote);
        this.next();
    }

}
