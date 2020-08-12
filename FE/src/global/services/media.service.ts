import { Injectable } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    private stack: Map<string, [((value?: { success: boolean; url?: string; }) => void)[], ((reason?: any) => void)[]]>;

    constructor(
        private readonly fileTransfer: FileTransfer,
        private readonly file: File
    ) {
        this.stack = new Map<string, [((value?: { success: boolean; url?: string; }) => void)[], ((reason?: any) => void)[]]>();
    }

    public download(urlRemote: string): Promise<{ success: boolean; url?: string; }> {
        return new Promise<{ success: boolean; url?: string; }>((resolve, reject) => {
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

    public cached(urlRemote: string): Promise<boolean> {
        return this.file.checkFile(this.file.applicationStorageDirectory, new URL(urlRemote).pathname.replace(/^\/+/, '')).then((result) => result, _ => false).catch(_ => false);
    }

    private transfer(urlRemote: string, urlLocal: string): Promise<boolean> {
        return this.fileTransfer.create().download(urlRemote, urlLocal, true).then(_ => true, _ => false).catch(_ => false);
    }

    //

    private next(): void {
        if (this.stack.size > 0) {
            const urlRemote = this.stack.keys().next().value;
            const urlLocal = this.file.applicationStorageDirectory + new URL(urlRemote).pathname.replace(/^\/+/, '');
            const [resolvers, rejecters] = this.stack.get(urlRemote);
            this.cached(urlRemote).then((result) => {
                if (result) {
                    console.log('Media cached.', urlRemote, urlLocal);
                    this.nextResolve(resolvers, urlRemote, urlLocal);
                } else {
                    console.log('Media not cached. Downloading...', urlRemote, urlLocal);
                    this.transfer(urlRemote, urlLocal).then((result) => {
                        if (result) {
                            console.log('Media downloaded.', urlRemote, urlLocal);
                            this.nextResolve(resolvers, urlRemote, urlLocal);
                        } else {
                            console.warn('Unable to download.', urlRemote, urlLocal);
                            this.nextReject(resolvers, urlRemote);
                        }
                    });
                }
            });
        }
    }

    private nextResolve(resolvers: ((value?: { success: boolean; url?: string; }) => void)[], urlRemote: string, urlLocal: string): void {
        resolvers.forEach((resolve) => resolve({ success: true, url: Capacitor.convertFileSrc(urlLocal) }));
        this.stack.delete(urlRemote);
        this.next();
    }

    private nextReject(resolvers: ((value?: { success: boolean; url?: string; }) => void)[], urlRemote: string): void {
        resolvers.forEach((resolve) => resolve({ success: false }));
        this.stack.delete(urlRemote);
        this.next();
    }

}
