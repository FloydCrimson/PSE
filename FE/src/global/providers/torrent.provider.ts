import { Injectable } from '@angular/core';
import * as WebTorrent from 'webtorrent';
import * as ParseTorrent from 'parse-torrent';
import * as BittorrentProtocol from 'bittorrent-protocol';
import { Observable } from 'rxjs';

// https://github.com/webtorrent/webtorrent/blob/HEAD/docs/api.md

@Injectable({
    providedIn: 'root'
})
export class TorrentProvider {

    constructor() { }

    /**
     * @remarks
     * Create a new Instance
     * @param config Additional configurations for the Instance creation
     * @returns The created Instance
     */
    public static createInstance(config?: WebTorrent.Options): WebTorrent.Instance {
        return new WebTorrent(config);
    }

    /**
     * @remarks
     * Create an Observable from all Instance related events 
     * @param instance The Instance from wich create the Observable
     * @returns The created Observable
     */
    public static getInstanceObservable(instance: WebTorrent.Instance): Observable<{ instance: WebTorrent.Instance; event: keyof InstanceEventImplementation; data: {} }> {
        return new Observable<{ instance: WebTorrent.Instance; event: keyof InstanceEventImplementation; data: {} }>(observer => {
            instance.on('torrent', (torrent: WebTorrent.Torrent) => observer.next({ instance: instance, event: 'torrent', data: { torrent } }));
            instance.on('error', (err: string | Error) => observer.next({ instance: instance, event: 'error', data: { err } }));
        });
    }

    /**
     * @remarks
     * Add a new Torrent
     * @param instance The Instance to wich add the Torrent
     * @param source The source from where create the Torrent
     * @param options Additional options for the Torrent creation
     * @returns The added Torrent
     */
    public static addTorrent(instance: WebTorrent.Instance, source: string | Buffer | File | ParseTorrent.Instance, options?: WebTorrent.TorrentOptions): WebTorrent.Torrent {
        return instance.add(source, options);
    }

    /**
     * @remarks
     * Create an Observable from all Torrent related events 
     * @param torrent The Torrent from wich create the Observable
     * @returns The created Observable
     */
    public static getTorrentObservable(torrent: WebTorrent.Torrent): Observable<{ torrent: WebTorrent.Torrent; event: keyof TorrentEventImplementation; data: {} }> {
        return new Observable<{ torrent: WebTorrent.Torrent; event: keyof TorrentEventImplementation; data: {} }>(observer => {
            torrent.on('ready', () => observer.next({ torrent: torrent, event: 'ready', data: {} }));
            torrent.on('infoHash', () => observer.next({ torrent: torrent, event: 'infoHash', data: {} }));
            torrent.on('metadata', () => observer.next({ torrent: torrent, event: 'metadata', data: {} }));
            torrent.on('done', () => observer.next({ torrent: torrent, event: 'done', data: {} }));
            torrent.on('upload', (bytes: number) => observer.next({ torrent: torrent, event: 'upload', data: { bytes } }));
            torrent.on('download', (bytes: number) => observer.next({ torrent: torrent, event: 'download', data: { bytes } }));
            torrent.on('error', (err: Error | string) => observer.next({ torrent: torrent, event: 'error', data: { err } }));
            torrent.on('warning', (err: Error | string) => observer.next({ torrent: torrent, event: 'warning', data: { err } }));
            torrent.on('noPeers', (announceType: 'tracker' | 'dht') => observer.next({ torrent: torrent, event: 'noPeers', data: { announceType } }));
            torrent.on('wire', (wire: BittorrentProtocol.Wire, addr?: string) => observer.next({ torrent: torrent, event: 'wire', data: { wire, addr } }));
        });
    }

}

export interface InstanceEventImplementation {
    /** Emitted when a torrent is ready to be used (i.e. metadata is available and store is ready). */
    'torrent': { torrent: WebTorrent.Torrent; };
    /** Emitted when the client encounters a fatal error. The client is automatically destroyed and all torrents are removed and cleaned up when this occurs. */
    'error': { err: string | Error; };
}

export interface TorrentEventImplementation {
    /** Emitted when the torrent is ready to be used (i.e. metadata is available and store is ready). */
    'ready': {};
    /** Emitted when the info hash of the torrent has been determined. */
    'infoHash': {};
    /** Emitted when the metadata of the torrent has been determined. This includes the full contents of the .torrent file, including list of files, torrent length, piece hashes, piece length, etc. */
    'metadata': {};
    /** Emitted when all the torrent files have been downloaded. */
    'done': {};
    /** Emitted whenever data is uploaded. Useful for reporting the current torrent status. */
    'upload': { bytes: number; };
    /** Emitted whenever data is downloaded. Useful for reporting the current torrent status. */
    'download': { bytes: number; };
    /** Emitted when the torrent encounters a fatal error. The torrent is automatically destroyed and removed from the client when this occurs. */
    'error': { err: Error | string; };
    /** Emitted when there is a warning. This is purely informational and it is not necessary to listen to this event, but it may aid in debugging. */
    'warning': { err: Error | string; };
    /** Emitted whenever a DHT or tracker announce occurs, but no peers have been found. */
    'noPeers': { announceType: 'tracker' | 'dht'; };
    /** Emitted whenever a new peer is connected for this torrent. */
    'wire': { wire: BittorrentProtocol.Wire; addr?: string; };
}
