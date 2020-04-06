import { Injectable } from '@angular/core';
import * as WebTorrent from 'webtorrent';
import * as ParseTorrent from 'parse-torrent';
import * as BittorrentProtocol from 'bittorrent-protocol';
import { Observable } from 'rxjs';

import { TorrentProvider, InstanceEventImplementation, TorrentEventImplementation } from 'global/providers/torrent.provider';
import { LoggingProvider } from 'global/providers/logging.provider';

@Injectable({
    providedIn: 'root'
})
export class TorrentService {

    private instanceData: { instance: WebTorrent.Instance; observable: Observable<{ instance: WebTorrent.Instance; event: keyof InstanceEventImplementation; data: {}; }>; };

    constructor() {
        this.instanceData = { instance: undefined, observable: undefined };
    }

    public start(): void {
        if (!this.instanceData.instance) {
            this.instanceData.instance = TorrentProvider.createInstance();
            this.instanceData.observable = TorrentProvider.getInstanceObservable(this.instanceData.instance);
            this.instanceData.observable.subscribe(value => {
                if (value.event === 'error') {
                    const err: string | Error = (<InstanceEventImplementation['error']>value.data)[0];
                    LoggingProvider.WARN('[TorrentService] A fatal error occurred. The service will be stopped.', err);
                    this.stop();
                }
            });
            LoggingProvider.DEBUG('[TorrentService] Service started.', this.instanceData.instance);
        } else {
            LoggingProvider.WARN('[TorrentService] Service already started.');
        }
    }

    public stop(): void {
        if (this.instanceData.instance) {
            this.instanceData = { instance: undefined, observable: undefined };
            LoggingProvider.DEBUG('[TorrentService] Service stopped.', this.instanceData.instance);
        } else {
            LoggingProvider.WARN('[TorrentService] Service already stopped.');
        }
    }

    public addTorrent(source: string | Buffer | File | ParseTorrent.Instance, options?: WebTorrent.TorrentOptions): { torrent: WebTorrent.Torrent; observable: Observable<{ torrent: WebTorrent.Torrent; event: keyof TorrentEventImplementation; data: {}; }>; } {
        if (this.instanceData.instance) {
            const torrent: WebTorrent.Torrent = TorrentProvider.addTorrent(this.instanceData.instance, source, options);
            const observable: Observable<{ torrent: WebTorrent.Torrent; event: keyof TorrentEventImplementation; data: {}; }> = TorrentProvider.getTorrentObservable(torrent);
            return { torrent, observable };
        } else {
            LoggingProvider.WARN('[TorrentService] Service not started.');
            return { torrent: undefined, observable: undefined };
        }
    }

    public getInstanceData(): { instance: WebTorrent.Instance; observable: Observable<{ instance: WebTorrent.Instance; event: keyof InstanceEventImplementation; data: {}; }>; } {
        return this.instanceData;
    }

}
