export enum PlatformEnum {
    Unknown = 0,
    Mobile = 1 << 0,
    Desktop = 1 << 1,
    Browser = 1 << 2,
    Android = 1 << 3,
    iOS = 1 << 4,
    DesktopBrowser = PlatformEnum.Desktop | PlatformEnum.Browser,
    AndroidMobile = PlatformEnum.Android | PlatformEnum.Mobile,
    AndroidBrowser = PlatformEnum.Android | PlatformEnum.Browser,
    iOSMobile = PlatformEnum.iOS | PlatformEnum.Mobile,
    iOSBrowser = PlatformEnum.iOS | PlatformEnum.Browser
}
