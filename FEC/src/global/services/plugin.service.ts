import { Injectable } from '@angular/core';
import { Plugins, AccessibilityPlugin, AppPlugin, BackgroundTaskPlugin, BrowserPlugin, CameraPlugin, ClipboardPlugin, DevicePlugin, FilesystemPlugin, GeolocationPlugin, HapticsPlugin, KeyboardPlugin, LocalNotificationsPlugin, ModalsPlugin, MotionPlugin, NetworkPlugin, PermissionsPlugin, PhotosPlugin, PushNotificationsPlugin, SharePlugin, SplashScreenPlugin, StatusBarPlugin, StoragePlugin, ToastPlugin, WebViewPlugin } from '@capacitor/core';

import { LoggingService } from './logging.service';

@Injectable({
    providedIn: 'root'
})
export class PluginService {

    constructor(
        private readonly loggingService: LoggingService
    ) { }

    public get<P extends keyof CapacitorPluginRegistry>(plugin: P): CapacitorPluginRegistry[P] {
        if (plugin in Plugins) {
            return Plugins[plugin];
        } else {
            this.loggingService.LOG('WARN', { class: PluginService.name, function: this.get.name, text: `Plugin "${plugin}" not found.` });
            return undefined;
        }
    }

}

interface CapacitorPluginRegistry {
    Accessibility: AccessibilityPlugin;
    App: AppPlugin;
    BackgroundTask: BackgroundTaskPlugin;
    Browser: BrowserPlugin;
    Camera: CameraPlugin;
    Clipboard: ClipboardPlugin;
    Device: DevicePlugin;
    Filesystem: FilesystemPlugin;
    Geolocation: GeolocationPlugin;
    Haptics: HapticsPlugin;
    Keyboard: KeyboardPlugin;
    LocalNotifications: LocalNotificationsPlugin;
    Modals: ModalsPlugin;
    Motion: MotionPlugin;
    Network: NetworkPlugin;
    Permissions: PermissionsPlugin;
    Photos: PhotosPlugin;
    PushNotifications: PushNotificationsPlugin;
    Share: SharePlugin;
    SplashScreen: SplashScreenPlugin;
    StatusBar: StatusBarPlugin;
    Storage: StoragePlugin;
    Toast: ToastPlugin;
    WebView: WebViewPlugin;
}
