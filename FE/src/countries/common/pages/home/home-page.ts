import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as WebTorrent from 'webtorrent';
import * as ParseTorrent from 'parse-torrent';
import * as BittorrentProtocol from 'bittorrent-protocol';
import { Observable, of, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { TorrentService } from 'global/services/torrent.service';
import { InstanceEventImplementation, TorrentEventImplementation } from 'global/providers/torrent.provider';
import { LoggingProvider } from 'global/providers/logging.provider';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  // https://webtorrent.io/torrents/sintel.torrent

  public instanceUI: InstanceUI;
  public torrentUIList: TorrentUI[] = [];

  constructor(
    private readonly alertController: AlertController,
    private readonly torrentService: TorrentService
  ) { }

  ngOnInit(): void {
    this.torrentService.start();
    this.instanceUI = new InstanceUI(this.torrentService.getInstanceData());
    this.instanceUISubscribe(this.instanceUI);
  }

  ngOnDestroy(): void {
    this.instanceUI.unsubscribe();
    this.torrentUIList.forEach(torrentUI => torrentUI.unsubscribe());
  }

  public onFabAddClicked(): void {
    this.alertController.create({
      header: 'Add a new Torrent',
      message: 'Insert a magnet link or a link to a .torrent file.',
      inputs: [
        {
          type: 'text',
          name: 'torrent'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.torrent.length > 0) {
              const source: string | Buffer | File | ParseTorrent.Instance = data.torrent;
              const torrentUI = new TorrentUI(this.torrentService.addTorrent(source));
              this.torrentUISubscribe(torrentUI);
            }
          }
        }
      ]
    }).then(alert => alert.present());
  }

  public startOrPauseTorrent(torrentUI: TorrentUI, index?: number): void {
    if (index !== undefined) {
      if (!torrentUI.paused) {
        if (!torrentUI.fileUIList[index].selected) {
          // INFO: file.deselect() does not work. This is a workaround. => https://github.com/webtorrent/webtorrent/issues/164
          torrentUI.torrentData.torrent.deselect(0, torrentUI.torrentData.torrent.pieces.length - 1, 0);
          torrentUI.fileUIList.forEach((file, index) => {
            if (file.selected) {
              torrentUI.torrentData.torrent.files[index].select();
            }
          });
          //
        } else {
          torrentUI.torrentData.torrent.files[index].select();
        }
      }
    } else {
      torrentUI.paused = !torrentUI.paused;
      if (torrentUI.paused) {
        torrentUI.torrentData.torrent.deselect(0, torrentUI.torrentData.torrent.pieces.length - 1, 0);
      } else {
        torrentUI.fileUIList.forEach((file, index) => {
          if (file.selected) {
            torrentUI.torrentData.torrent.files[index].select();
          }
        });
      }
    }
  }

  public openOrCloseAccordion(torrentUI: TorrentUI): void {
    torrentUI.accordionOpened = !torrentUI.accordionOpened;
  }

  // INSTANCE EVENT

  private instanceUISubscribe(instanceUI: InstanceUI): void {
    instanceUI.instanceData.observable.subscribe(value => {
      if (value.event === 'torrent') {
        this.manageInstanceEventTorrent(instanceUI, <any>value.data);
      } else if (value.event === 'error') {
        this.manageInstanceEventError(instanceUI, <any>value.data);
      }
    });
  }

  private manageInstanceEventTorrent(instanceUI: InstanceUI, data: InstanceEventImplementation['torrent']): void {

  }

  private manageInstanceEventError(instanceUI: InstanceUI, data: InstanceEventImplementation['error']): void {
    this.alertController.create({
      header: 'Error',
      message: (typeof data.err === 'string' ? data.err : (data.err as Error).message) + ' The service will be restarted.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            instanceUI.unsubscribe();
            this.torrentUIList.forEach(torrentUI => torrentUI.unsubscribe());
            this.torrentUIList = [];
            this.torrentService.stop();
            this.torrentService.start();
            this.instanceUI = new InstanceUI(this.torrentService.getInstanceData());
            this.instanceUISubscribe(this.instanceUI);

          }
        }
      ]
    }).then(alert => alert.present());;
  }

  // TORRENT EVENT

  private torrentUISubscribe(torrentUI: TorrentUI): void {
    torrentUI.torrentData.observable.subscribe(value => {
      if (value.event === 'ready') {
        this.manageTorrentEventReady(torrentUI, <any>value.data);
      } else if (value.event === 'infoHash') {
        this.manageTorrentEventInfoHash(torrentUI, <any>value.data);
      } else if (value.event === 'metadata') {
        this.manageTorrentEventMetadata(torrentUI, <any>value.data);
      } else if (value.event === 'done') {
        this.manageTorrentEventDone(torrentUI, <any>value.data);
      } else if (value.event === 'upload') {
        this.manageTorrentEventUpload(torrentUI, <any>value.data);
      } else if (value.event === 'download') {
        this.manageTorrentEventDownload(torrentUI, <any>value.data);
      } else if (value.event === 'error') {
        this.manageTorrentEventError(torrentUI, <any>value.data);
      } else if (value.event === 'warning') {
        this.manageTorrentEventWarning(torrentUI, <any>value.data);
      } else if (value.event === 'noPeers') {
        this.manageTorrentEventNoPeers(torrentUI, <any>value.data);
      } else if (value.event === 'wire') {
        this.manageTorrentEventWire(torrentUI, <any>value.data);
      }
    });
  }

  private manageTorrentEventReady(torrentUI: TorrentUI, data: TorrentEventImplementation['ready']): void {
    this.startOrPauseTorrent(torrentUI);
    this.openOrCloseAccordion(torrentUI);
    this.torrentUIList.push(torrentUI);
  }

  private manageTorrentEventInfoHash(torrentUI: TorrentUI, data: TorrentEventImplementation['infoHash']): void {

  }

  private manageTorrentEventMetadata(torrentUI: TorrentUI, data: TorrentEventImplementation['metadata']): void {

  }

  private manageTorrentEventDone(torrentUI: TorrentUI, data: TorrentEventImplementation['done']): void {

  }

  private manageTorrentEventUpload(torrentUI: TorrentUI, data: TorrentEventImplementation['upload']): void {

  }

  private manageTorrentEventDownload(torrentUI: TorrentUI, data: TorrentEventImplementation['download']): void {

  }

  private manageTorrentEventError(torrentUI: TorrentUI, data: TorrentEventImplementation['error']): void {
    this.alertController.create({
      header: 'Error',
      message: typeof data.err === 'string' ? data.err : (data.err as Error).message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            torrentUI.unsubscribe();
            this.torrentUIList = this.torrentUIList.filter(t => t !== torrentUI);
          }
        }
      ]
    }).then(alert => alert.present());;
  }

  private manageTorrentEventWarning(torrentUI: TorrentUI, data: TorrentEventImplementation['warning']): void {

  }

  private manageTorrentEventNoPeers(torrentUI: TorrentUI, data: TorrentEventImplementation['noPeers']): void {

  }

  private manageTorrentEventWire(torrentUI: TorrentUI, data: TorrentEventImplementation['wire']): void {

  }

}

export class InstanceUI {

  private interval: number = 200;
  private subscriptions: Subscription[] = [];

  public downloadSpeed: number;
  public uploadSpeed: number;
  public progress: number;
  public ratio: number;

  constructor(
    public readonly instanceData: { instance: WebTorrent.Instance; observable: Observable<{ instance: WebTorrent.Instance; event: keyof InstanceEventImplementation; data: {}; }>; }
  ) {
    this.initialize();
    this.update();
    this.subscribe();
  }

  private initialize(): void {

  }

  private update(): void {
    const subscription = timer(0, this.interval).pipe(map(_ => this.instanceData.instance)).subscribe(instance => {
      this.downloadSpeed = instance.downloadSpeed;
      this.uploadSpeed = instance.uploadSpeed;
      this.progress = instance.progress;
      this.ratio = instance.ratio;
    });
    this.subscriptions.push(subscription);
  }

  public unsubscribe(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // INSTANCE EVENT

  private subscribe(): void {
    const subscription = this.instanceData.observable.subscribe(value => {
      if (value.event === 'torrent') {
        this.manageInstanceEventTorrent(value.instance, <any>value.data);
      } else if (value.event === 'error') {
        this.manageInstanceEventError(value.instance, <any>value.data);
      }
    });
    this.subscriptions.push(subscription);
  }

  private manageInstanceEventTorrent(instance: WebTorrent.Instance, data: InstanceEventImplementation['torrent']): void {

  }

  private manageInstanceEventError(instance: WebTorrent.Instance, data: InstanceEventImplementation['error']): void {

  }

}

export class TorrentUI {

  private interval: number = 200;
  private subscriptions: Subscription[] = [];

  public accordionOpened: boolean;
  public paused: boolean;
  public name: string;
  public downloadSpeed: number;
  public uploadSpeed: number;
  public progress: number;
  public timeRemaining: number;
  public fileUIList: {
    path: string;
    progress: number;
    length: number;
    selected: boolean;
  }[] = [];

  constructor(
    public readonly torrentData: { torrent: WebTorrent.Torrent; observable: Observable<{ torrent: WebTorrent.Torrent; event: keyof TorrentEventImplementation; data: {}; }>; }
  ) {
    this.subscribe();
  }

  private initialize(): void {
    this.accordionOpened = false;
    this.paused = false;
    this.name = this.torrentData.torrent.name;
    this.fileUIList = this.torrentData.torrent.files.map((file, index) => {
      return {
        selected: true,
        length: file.length,
        path: file.path,
        progress: (<any>file).progress
      };
    });
  }

  private update(): void {
    const subscription = timer(0, this.interval).pipe(map(_ => this.torrentData.torrent)).subscribe(torrent => {
      this.downloadSpeed = torrent.downloadSpeed;
      this.uploadSpeed = torrent.uploadSpeed;
      this.progress = torrent.progress;
      this.timeRemaining = torrent.timeRemaining;
      this.fileUIList.forEach((fileUI, index) => fileUI.progress = (<any>torrent.files[index]).progress);
    });
    this.subscriptions.push(subscription);
  }

  public unsubscribe(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // TORRENT EVENT

  private subscribe(): void {
    const subscription = this.torrentData.observable.subscribe(value => {
      if (value.event === 'ready') {
        this.manageTorrentEventReady(value.torrent, <any>value.data);
      } else if (value.event === 'infoHash') {
        this.manageTorrentEventInfoHash(value.torrent, <any>value.data);
      } else if (value.event === 'metadata') {
        this.manageTorrentEventMetadata(value.torrent, <any>value.data);
      } else if (value.event === 'done') {
        this.manageTorrentEventDone(value.torrent, <any>value.data);
      } else if (value.event === 'upload') {
        this.manageTorrentEventUpload(value.torrent, <any>value.data);
      } else if (value.event === 'download') {
        this.manageTorrentEventDownload(value.torrent, <any>value.data);
      } else if (value.event === 'error') {
        this.manageTorrentEventError(value.torrent, <any>value.data);
      } else if (value.event === 'warning') {
        this.manageTorrentEventWarning(value.torrent, <any>value.data);
      } else if (value.event === 'noPeers') {
        this.manageTorrentEventNoPeers(value.torrent, <any>value.data);
      } else if (value.event === 'wire') {
        this.manageTorrentEventWire(value.torrent, <any>value.data);
      }
    });
    this.subscriptions.push(subscription);
  }

  private manageTorrentEventReady(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['ready']): void {
    this.initialize();
    this.update();
  }

  private manageTorrentEventInfoHash(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['infoHash']): void {

  }

  private manageTorrentEventMetadata(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['metadata']): void {

  }

  private manageTorrentEventDone(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['done']): void {

  }

  private manageTorrentEventUpload(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['upload']): void {

  }

  private manageTorrentEventDownload(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['download']): void {

  }

  private manageTorrentEventError(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['error']): void {

  }

  private manageTorrentEventWarning(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['warning']): void {

  }

  private manageTorrentEventNoPeers(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['noPeers']): void {

  }

  private manageTorrentEventWire(torrent: WebTorrent.Torrent, data: TorrentEventImplementation['wire']): void {

  }

}
